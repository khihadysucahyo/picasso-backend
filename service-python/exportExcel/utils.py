from datetime import datetime, timedelta
from collections import OrderedDict

def monthlist_short(dates):
    start, end = [datetime.strptime(_, "%Y-%m-%d") for _ in dates]
    return OrderedDict(((start + (timedelta(_))).strftime(r"%d/%m/%Y"), None) for _ in xrange(((end+timedelta(days=1)) - start).days)).keys()
