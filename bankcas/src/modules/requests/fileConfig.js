
export const djsConfig = {
  addRemoveLinks: true,
  acceptedFiles: "image/jpeg,image/png,image/gif,application/msword",
  autoProcessQueue: true,
  maxFilesize: 200,
  parallelUploads: 1,
  uploadMultiple: false
};

export const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif', '.doc', '.docs'],
  showFiletypeIcon: false,
  postUrl: 'http://localhost:5000/api/v1/productDetails/upload'
};

export const acceptTypeFile = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/tiff",
  "application/pdf",
  "application/msword",
  "application/x-pdf",
  "application/acrobat",
  "applications/vnd.pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain"
];

export const maxFilesize = 20000000;