const fileToNumArray = (file) => {
  return file
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

export default fileToNumArray;
