function register_mpi() {
  console.log("inside register MPI >>");
  if (!(window.opener === null)) {
      if (replaceXhtmlSuffix(window.opener.location.pathname) !== replaceXhtmlSuffix(window.location.pathname)) {
        window.opener.setmpiChild(this);
      }
  }
  console.log('window opener MPI >> ' + window.opener);
}

function replaceXhtmlSuffix(input) {
  var result = input;
  if (input !== null && input !== undefined) {
    result = input.replace(".xhtml", "");
  }
  return result;
}

window.addEventListener("load", register_mpi);
