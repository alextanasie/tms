const handleUiError = (err, reject) => {
  const errMsg = err && err.response && err.response.data;
  if (errMsg) {
    console.error("Error: ", err.response.data);
    alert(`Error: ${err.response.data}`);
  }
  return reject(err.response.data);
};

export { handleUiError };
