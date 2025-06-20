import datetime, enum, csv
from dataclasses import dataclass
import life
from enum import StrEnum


class Corp(StrEnum):
    OTHER = "OTHER"
    LEUMI = "LEUMI"
    POALIM = "POALIM"
    MERCANTILE = "MERCANTILE"


class Action(StrEnum):
    CREDIT_CARD = "CREDIT_CARD"
    TRANSFER = "TRANSFER"
    CASH_CHECK = "CASH_CHECK"
    STANDING_ORDER = "STANDING_ORDER"
    FOREX = "FOREX"
    COMMISSION = "COMMISSION"
    UNKNOWN = "UNKNOWN"


@dataclass
class BankTransaction:
    filename: str
    corp: Corp
    account_number: str
    date: datetime.datetime
    action: str
    details: str
    reference: str
    amount: int
    balance: int
    value_date: datetime.datetime
    action_type: Action
    domain: life.Domain = life.Domain.UNSPECIFIED