from fastapi import APIRouter
from pydantic import BaseModel, constr, EmailStr, Field
router = APIRouter()


class A_Route_Inputs(BaseModel):
    name: constr(min_length=5, max_length=20)
    last_name: constr(min_length=5, max_length=20)

class Return_A_Route():
    name_r = ""
    last_name_r = ""
    def __init__(self, param1, param2):
        self.last_name_r = param1
        self.name_r = param2


@router.post("/a_route")
def user(test_input: A_Route_Inputs):
    return_value = Return_A_Route(test_input.name + "10", test_input.last_name + "10")
    #return_value.name_r = test_input.name + "10"
    #return_value.last_name_r = test_input.last_name + "10"
    return return_value
