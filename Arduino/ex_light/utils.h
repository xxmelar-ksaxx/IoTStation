String bool_to_str(bool val){
  if(val){
    return "true";
  }
  return "false";
}

bool str_to_bool(String bool_val){
  if(bool_val=="true"){
    return true;
  }
  return false;
}