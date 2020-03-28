var pageHTML = window.document.getElementById("divToPDF").innerHTML;
let data = new Blob([pageHTML], { type: "data:attachment/text," });
let csvURL = window.URL.createObjectURL(data);
let tempLink = document.createElement("a");
tempLink.href = csvURL;
tempLink.setAttribute("download", "Graph.html");
tempLink.click();
