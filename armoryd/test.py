################################################################################
#
# Copyright (C) 2012, Ian Coleman
# Distributed under the GNU Affero General Public License (AGPL v3)
# See http://www.gnu.org/licenses/agpl.html
#
################################################################################

# Tests for armory-daemon.py
# Depends on jsonrpc - https://github.com/jgarzik/python-bitcoinrpc
# Ensure armory-daemon is running before commencing tests

import decimal
import json
from jsonrpc import ServiceProxy


class UniversalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return json.JSONEncoder.default(self, obj)

access = ServiceProxy("http://alice:s3cr3t@127.0.0.1:7070")

# TODO use asserts on this, for now manual inspection will do
newaddress = access.getnewaddress()
print "getnewaddress: %s" % newaddress
