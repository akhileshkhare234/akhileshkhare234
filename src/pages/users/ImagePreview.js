import React from "react";

export default function ImagePreview({
  imagePreviewPopUp,
  imagePreviewPopUpClose,
  imageData,
}) {
  return (
    <div
      className={
        "modal modal-signin position-static bg-secondary py-1 " +
        (imagePreviewPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Image Preview</h1>
            <button
              onClick={() => imagePreviewPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body px-3 pt-0 text-center">
            <hr className="mb-3" />
            <img
              style={{ width: "90%" }}
              src={
                imageData?.imageUrl
                  ? imageData.imageUrl
                  : imageData?.gender === "Female"
                  ? process.env.PUBLIC_URL + "/images/female.png"
                  : process.env.PUBLIC_URL + "/images/male.png"
              }
              alt=""
            />
            <h5 className="mt-2">{imageData?.displayName}</h5>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
