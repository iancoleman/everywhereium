################################################################################
#
# Copyright (C) 2012, Ian Coleman
# Distributed under the GNU Affero General Public License (AGPL v3)
# See http://www.gnu.org/licenses/agpl.html
#
################################################################################

# This is a json-rpc interface to armory - http://bitcoinarmory.com/
#
# Where possible this follows conventions established by the Satoshi client.
# Does not require armory to be installed or running, this is a standalone application.
# Requires bitcoind process to be running before starting armory-daemon.
# Requires an armory watch-only wallet to be in the same folder as the
# armory-daemon script.
# Works with testnet, use --testnet flag when starting the script.
#
# BEWARE:
# This is relatively untested, please use caution. There should be no chance for
# irreversible damage to be done by this software, but it is still in the early
# development stage so treat it with the appropriate level of skepticism.

# Many thanks must go to etotheipi who started the armory client, and who has
# provided immense amounts of help with this. This app is mostly chunks
# of code taken from armory and refurbished into an rpc client.
# See the bitcontalk thread for more details about this software:
# https://bitcointalk.org/index.php?topic=92496.0

from twisted.web import server
from twisted.internet import reactor
from txjsonrpc.web import jsonrpc

from twisted.cred.checkers import FilePasswordDB
from txjsonrpc.auth import wrapResource

import datetime
import decimal
import os
import sys

RPC_PORT = 7070

class Wallet_Json_Rpc_Server(jsonrpc.JSONRPC):

    def __init__(self, wallet):
        self.wallet = wallet

    def jsonrpc_getnewaddress(self):
        addr = self.wallet.getNextUnusedAddress()
        return addr.getAddrStr()

class Armory_Daemon():

    def __init__(self):

        sys.stdout.write("\nReading wallet file")
        self.wallet = self.find_wallet()

        sys.stdout.write("\nInitialising server")
        resource = Wallet_Json_Rpc_Server(self.wallet)
        secured_resource = self.set_auth(resource)
        reactor.listenTCP(RPC_PORT, server.Site(secured_resource))

        sys.stdout.write("\nServer started")
        sys.stdout.flush()
        self.start()

    def set_auth(self, resource):
        passwordfile = "credentials.conf"
        checker = FilePasswordDB(passwordfile)
        realmName = "Armory JSON-RPC App"
        wrapper = wrapResource(resource, [checker], realmName=realmName)
        return wrapper

    def start(self):
        reactor.run()

    def find_wallet(self):
        fnames = os.listdir(os.getcwd())
        for fname in fnames:
            is_wallet = fname[-7:] == ".wallet"
            is_watchonly = fname.find("watchonly") > -1
            is_backup = fname.find("backup") > -1
            if(is_wallet and is_watchonly and not is_backup):
                wallet = PyBtcWallet().readWalletFile(fname)
                sys.stdout.write("\nUsing wallet file %s" % fname)
                return wallet
        raise ValueError('Unable to locate a watch-only wallet in %s' % os.getcwd())

if __name__ == "__main__":
    from armoryengine import *
    rpc_server = Armory_Daemon()
