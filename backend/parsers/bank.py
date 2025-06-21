import datetime
from dataclasses import dataclass
from enum import StrEnum
from editor.actions import Action
import editor.domains as domains


class Corp(StrEnum):
    OTHER = "OTHER"
    LEUMI = "LEUMI"
    POALIM = "POALIM"
    MERCANTILE = "MERCANTILE"


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
    domain: domains.Domain = domains.Domain.UNSPECIFIED