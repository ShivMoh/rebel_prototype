async function onSubmit(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  const initialDataObj = Object.fromEntries(formData.entries());

  // let's say i get some data back here, how do i then update the form
  const response = await fetch("http://localhost:4000/api/update-names", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(initialDataObj)
  });

  const updatedData = await response.json();

  console.log("updated form data", updatedData);

}
