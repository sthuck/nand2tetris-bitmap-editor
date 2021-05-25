export function GenerateBitMapCode(grid) {
  let i, j;

  let code =
    "function void draw" +
    "(int location) {\n\tlet memAddress = 16384+location;\n";

  for (i = 0; i < 16; i++) {
    //get grid binary representation
    let binary = "";
    for (j = 0; j < 16; j++) {
      if (grid[i][j]) binary = "1" + binary;
      else binary = "0" + binary;
    }

    let isNegative = false;
    //if number is negative, get its  one's complement
    if (binary[0] === "1") {
      isNegative = true;
      let oneComplement = "";
      for (let k = 0; k < 16; k++) {
        if (binary[k] === "1") oneComplement = oneComplement + "0";
        else oneComplement = oneComplement + "1";
      }
      binary = oneComplement;
    }

    //calculate one's complement decimal value
    let value = 0;
    for (let k = 0; k < 16; k++) {
      value = value * 2;
      if (binary[k] === "1") value = value + 1;
    }

    //two's complement value if it is a negative value
    if (isNegative === true) value = -(value + 1);

    code += GenerateCodeLine(i, value);
  }

  code += "\treturn;\n}";
  return code;
}

function GenerateCodeLine(row, value) {
  const str = "\tdo Memory.poke(memAddress+" + row * 32 + ", " + value + ");\n";
  return str;
}
