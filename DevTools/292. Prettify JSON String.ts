// do not change function name
function prettifyJSON(jsonString: string): string {
  // write your solution here
  try {return JSON.stringify(JSON.parse(jsonString), null, 4);}
  catch(e) {return "Invalid JSON";}
}
