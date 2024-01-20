const filePickerElement = document.getElementById("image");
const imagePreviewElement = document.getElementById("image-preview");

function showPreview() {
    // because we can pick multiple files using file picker that'why we have to take it in plural/array:-
  const files = filePickerElement.files;
  if (!files || files.length === 0) {
    imagePreviewElement.style.display = "none";
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = "block";
}

filePickerElement.addEventListener("change", showPreview);
