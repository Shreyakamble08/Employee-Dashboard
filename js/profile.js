// ---------- DATA ----------
let educationList = [
  {
    degree: "B.Tech CSE",
    institute: "NIT Trichy",
    year: "2018",
    percentage: "8.9 CGPA",
  },
];
let familyList = [
  {
    name: "Sarah Mercer",
    relationship: "Spouse",
    occupation: "Architect",
    phone: "9876543211",
  },
];
let experienceList = [
  {
    company: "TechCorp",
    designation: "Software Engineer",
    years: "3",
    location: "Bangalore",
  },
];
let documents = {
  "Aadhaar Card": { uploaded: false, name: "", size: 0, url: null },
  "PAN Card": { uploaded: false, name: "", size: 0, url: null },
  "Degree Certificate": { uploaded: false, name: "", size: 0, url: null },
  "Experience Letter": { uploaded: false, name: "", size: 0, url: null },
};
let currentStep = 1,
  isEditMode = false,
  currentModalType = null,
  currentEditIndex = null;
let formData = { personal: {}, job: {}, contact: {} };

// Helper toast
function showSuccessToast(msg) {
  Toastify({
    text: `✓ ${msg}`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    backgroundColor: "#6FAF2E",
    className: "toast-success",
    stopOnFocus: true,
    style: {
      borderRadius: "10px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 10px 20px rgba(111, 175, 46, 0.25)",
      letterSpacing: "0.2px",
    },
  }).showToast();
}
function showErrorToast(msg) {
  Toastify({
    text: `✕ ${msg}`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    backgroundColor: "#E56C6C",
    className: "toast-error",
    stopOnFocus: true,
    style: {
      borderRadius: "10px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 10px 20px rgba(229, 108, 108, 0.25)",
      letterSpacing: "0.2px",
    },
  }).showToast();
}

const steps = [
  "Personal Information",
  "Job Details",
  "Contact & Address",
  "Education & Family",
  "Documents",
];
function renderStepper() {
  const container = document.getElementById("stepper");
  container.innerHTML = steps
    .map(
      (l, idx) =>
        `<div class="step" data-step="${idx + 1}"><div class="step-circle">${idx + 1}</div><div class="step-label">${l}</div></div>`,
    )
    .join("");
  updateStepperUI();
  document.querySelectorAll(".step").forEach((step) =>
    step.addEventListener("click", () => {
      let s = parseInt(step.dataset.step);
      if (s <= currentStep + 1) {
        currentStep = s;
        renderCurrentStep();
      }
    }),
  );
}
function updateStepperUI() {
  document.querySelectorAll(".step").forEach((step, idx) => {
    let num = idx + 1;
    let circle = step.querySelector(".step-circle");
    if (num < currentStep) {
      step.classList.add("completed");
      step.classList.remove("active");
      circle.innerHTML = '<i class="fas fa-check"></i>';
    } else if (num === currentStep) {
      step.classList.add("active");
      step.classList.remove("completed");
      circle.innerHTML = num;
    } else {
      step.classList.remove("active", "completed");
      circle.innerHTML = num;
    }
  });
  document.getElementById("stepTitle").innerText = steps[currentStep - 1];
}

function validateStep(step) {
  if (step === 1) {
    let fname = document.getElementById("firstName")?.value;
    if (!fname) {
      showErrorToast("First Name is required");
      return false;
    }
    let lname = document.getElementById("lastName")?.value;
    if (!lname) {
      showErrorToast("Last Name is required");
      return false;
    }
    return true;
  }
  if (step === 2) {
    let dept = document.getElementById("department")?.value;
    if (!dept) {
      showErrorToast("Department is required");
      return false;
    }
    let desig = document.getElementById("designation")?.value;
    if (!desig) {
      showErrorToast("Designation is required");
      return false;
    }
    let joinDate = document.getElementById("joiningDate")?.value;
    if (!joinDate) {
      showErrorToast("Joining Date is required");
      return false;
    }
    let salary = document.getElementById("basicSalary")?.value;
    if (!salary || salary <= 0) {
      showErrorToast("Valid Basic Salary is required");
      return false;
    }
    return true;
  }
  if (step === 3) {
    let email = document.getElementById("personalEmail")?.value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showErrorToast("Valid Personal Email required");
      return false;
    }
    let mobile = document.getElementById("mobileNumber")?.value;
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      showErrorToast("Valid 10-digit Mobile Number required");
      return false;
    }
    let emerName = document.getElementById("emergencyName")?.value;
    if (!emerName) {
      showErrorToast("Emergency Contact Name required");
      return false;
    }
    let emerPhone = document.getElementById("emergencyPhone")?.value;
    if (!emerPhone || !/^\d{10}$/.test(emerPhone)) {
      showErrorToast("Valid Emergency Phone required");
      return false;
    }
    return true;
  }
  return true;
}

function renderCurrentStep() {
  const container = document.getElementById("stepContainer");
  if (currentStep === 1) container.innerHTML = getStep1HTML();
  else if (currentStep === 2) container.innerHTML = getStep2HTML();
  else if (currentStep === 3) container.innerHTML = getStep3HTML();
  else if (currentStep === 4) container.innerHTML = getStep4HTML();
  else if (currentStep === 5) container.innerHTML = getStep5HTML();
  attachStepEvents();
  if (!isEditMode) disableAllFields();
  else enableAllFields();
}

function disableAllFields() {
  document
    .querySelectorAll(
      "#stepContainer input, #stepContainer select, #stepContainer textarea",
    )
    .forEach((f) => (f.disabled = true));
}
function enableAllFields() {
  document
    .querySelectorAll(
      "#stepContainer input, #stepContainer select, #stepContainer textarea",
    )
    .forEach((f) => (f.disabled = false));
  document
    .querySelectorAll(".dynamic-actions button, .btn-add")
    .forEach((b) => (b.disabled = false));
}
function updateEditModeUI() {
  if (isEditMode) {
    enableAllFields();
    document.getElementById("editModeBtn").style.display = "none";
    document.getElementById("saveModeBtn").style.display = "inline-flex";
    document.getElementById("cancelModeBtn").style.display = "inline-flex";
  } else {
    disableAllFields();
    document.getElementById("editModeBtn").style.display = "inline-flex";
    document.getElementById("saveModeBtn").style.display = "none";
    document.getElementById("cancelModeBtn").style.display = "none";
  }
}

function getStep1HTML() {
  return `<div class="form-section"><div class="section-title"><i class="fas fa-user"></i> Personal Details</div><div class="form-grid"><div class="form-group"><label>First Name *</label><input type="text" id="firstName" value="Alex"></div><div class="form-group"><label>Middle Name</label><input type="text" id="middleName" value="James"></div><div class="form-group"><label>Last Name *</label><input type="text" id="lastName" value="Mercer"></div><div class="form-group"><label>Employee ID</label><input type="text" id="employeeId" value="EMP10234" readonly disabled></div><div class="form-group"><label>Date of Birth</label><input type="date" id="dob" value="1990-05-15"></div><div class="form-group"><label>Gender *</label><select id="gender"><option>Male</option><option>Female</option></select></div><div class="form-group"><label>PAN Number</label><input type="text" id="pan" value="ABCDE1234F"></div><div class="form-group"><label>Aadhaar Number</label><input type="text" id="aadhaar" value="123456789012"></div></div><div class="form-group" style="margin-top: 16px;"><label><input type="checkbox" id="pwdCheckbox"> Physically Challenged</label></div><div id="pwdFields" style="display: none; margin-top: 16px;" class="form-grid"><div class="form-group"><label>Type of Disability</label><input type="text" id="disabilityType"></div><div class="form-group"><label>Disability Percentage (0-100)</label><input type="number" id="disabilityPercent" min="0" max="100"></div><div class="form-group"><label>Certificate Number</label><input type="text" id="certificateNo"></div></div></div>`;
}
function getStep2HTML() {
  return `<div class="form-section"><div class="section-title"><i class="fas fa-briefcase"></i> Job & Bank</div><div class="form-grid"><div class="form-group"><label>Department *</label><select id="department"><option>Engineering</option><option>HR</option><option>Sales</option></select></div><div class="form-group"><label>Designation *</label><select id="designation"><option>Senior Developer</option><option>Lead Engineer</option></select></div><div class="form-group"><label>Joining Date *</label><input type="date" id="joiningDate" value="2020-06-01"></div><div class="form-group"><label>Basic Salary *</label><input type="number" id="basicSalary" value="85000"></div><div class="form-group"><label>Bank Name</label><input type="text" id="bankName" value="HDFC Bank"></div><div class="form-group"><label>Account Number</label><input type="text" id="accountNumber" value="123456789012"></div><div class="form-group"><label>IFSC Code</label><input type="text" id="ifsc" value="HDFC0001234"></div></div></div>`;
}
function getStep3HTML() {
  return `<div class="form-section"><div class="section-title"><i class="fas fa-address-card"></i> Contact & Address</div><div class="form-grid"><div class="form-group"><label>Personal Email *</label><input type="email" id="personalEmail" value="alex.mercer@example.com"></div><div class="form-group"><label>Mobile Number *</label><input type="text" id="mobileNumber" value="9876543210"></div></div><div class="section-title" style="margin-top: 20px;"><i class="fas fa-home"></i> Current Address</div><div class="form-grid"><div class="form-group"><label>Street</label><input id="curStreet" value="10th Main"></div><div class="form-group"><label>City</label><input id="curCity" value="Bangalore"></div><div class="form-group"><label>PIN Code</label><input id="curPin" value="560001"></div></div><div class="section-title" style="margin-top: 20px;"><i class="fas fa-permanent"></i> Permanent Address <button type="button" id="copyAddressBtn" class="btn-add" style="margin-left: auto;"><i class="fas fa-copy"></i> Copy from Current</button></div><div class="form-grid"><div class="form-group"><label>Street</label><input id="perStreet"></div><div class="form-group"><label>City</label><input id="perCity"></div><div class="form-group"><label>PIN Code</label><input id="perPin"></div></div><div class="section-title" style="margin-top: 20px;"><i class="fas fa-ambulance"></i> Emergency Contact</div><div class="form-grid"><div class="form-group"><label>Name *</label><input id="emergencyName" value="John Doe"></div><div class="form-group"><label>Relationship</label><input id="emergencyRelation" value="Brother"></div><div class="form-group"><label>Phone Number *</label><input id="emergencyPhone" value="9988776655"></div></div></div>`;
}
function getStep4HTML() {
  return `
<div class="form-section">

    <div class="section-title">
        <div class="title-left">
            <i class="fas fa-graduation-cap"></i>Education
        </div>
        <button class="btn-add" id="addEduBtn">
            <i class="fas fa-plus"></i>Add Education
        </button>
    </div>

    <div id="eduListContainer" class="dynamic-list"></div>

    <div class="section-title">
        <div class="title-left">
            <i class="fas fa-users"></i>Family
        </div>
        <button class="btn-add" id="addFamilyBtn">
            <i class="fas fa-plus"></i>Add Member
        </button>
    </div>

    <div id="familyListContainer" class="dynamic-list"></div>

    <div class="section-title">
        <div class="title-left">
            <i class="fas fa-briefcase"></i>Work Experience
        </div>
        <button class="btn-add" id="addExpBtn">
            <i class="fas fa-plus"></i>Add Experience
        </button>
    </div>

    <div id="expListContainer" class="dynamic-list"></div>

</div>`;
}
function getStep5HTML() {
  return `<div class="form-section"><div class="section-title"><i class="fas fa-file-alt"></i> Official Documents</div><div id="documentsContainer" class="documents-container"></div></div>`;
}

function renderDynamicLists() {
  let eduHtml =
    educationList
      .map(
        (e, i) =>
          `<div class="dynamic-item"><div><strong>${e.degree}</strong> - ${e.institute} (${e.year}) ${e.percentage ? `| ${e.percentage}` : ""}</div><div><button class="editItemBtn" data-type="education" data-index="${i}"><i class="fas fa-edit"></i></button> <button class="deleteItemBtn" data-type="education" data-index="${i}"><i class="fas fa-trash"></i></button></div></div>`,
      )
      .join("") || "<p>No records</p>";
  let familyHtml = familyList
    .map(
      (f, i) =>
        `<div class="dynamic-item"><div><strong>${f.name}</strong> (${f.relationship}) - ${f.occupation} | ${f.phone}</div><div><button class="editItemBtn" data-type="family" data-index="${i}"><i class="fas fa-edit"></i></button> <button class="deleteItemBtn" data-type="family" data-index="${i}"><i class="fas fa-trash"></i></button></div></div>`,
    )
    .join("");
  let expHtml = experienceList
    .map(
      (e, i) =>
        `<div class="dynamic-item"><div><strong>${e.company}</strong> - ${e.designation} (${e.years} yrs) | ${e.location}</div><div><button class="editItemBtn" data-type="experience" data-index="${i}"><i class="fas fa-edit"></i></button> <button class="deleteItemBtn" data-type="experience" data-index="${i}"><i class="fas fa-trash"></i></button></div></div>`,
    )
    .join("");
  document.getElementById("eduListContainer") &&
    (document.getElementById("eduListContainer").innerHTML = eduHtml);
  document.getElementById("familyListContainer") &&
    (document.getElementById("familyListContainer").innerHTML = familyHtml);
  document.getElementById("expListContainer") &&
    (document.getElementById("expListContainer").innerHTML = expHtml);
  document.querySelectorAll(".editItemBtn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      let type = btn.dataset.type,
        idx = btn.dataset.index;
      openEditModal(type, parseInt(idx));
    }),
  );
  document.querySelectorAll(".deleteItemBtn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      let type = btn.dataset.type,
        idx = btn.dataset.index;
      if (confirm("Delete?")) {
        if (type === "education") educationList.splice(idx, 1);
        if (type === "family") familyList.splice(idx, 1);
        if (type === "experience") experienceList.splice(idx, 1);
        renderDynamicLists();
        showSuccessToast("Deleted");
      }
    }),
  );
}

function openEditModal(type, idx) {
  currentModalType = type;
  currentEditIndex = idx;
  let item = null;
  if (type === "education") item = educationList[idx];
  if (type === "family") item = familyList[idx];
  if (type === "experience") item = experienceList[idx];
  if (!item) return;
  let fields = "";
  if (type === "education")
    fields = `<div class="form-group"><label>Degree</label><input id="modalField1" value="${item.degree}"></div><div class="form-group"><label>Institute</label><input id="modalField2" value="${item.institute}"></div><div class="form-group"><label>Year</label><input id="modalField3" value="${item.year}"></div><div class="form-group"><label>Percentage/CGPA</label><input id="modalField4" value="${item.percentage || ""}"></div>`;
  if (type === "family")
    fields = `<div class="form-group"><label>Name</label><input id="modalField1" value="${item.name}"></div><div class="form-group"><label>Relationship</label><input id="modalField2" value="${item.relationship}"></div><div class="form-group"><label>Occupation</label><input id="modalField3" value="${item.occupation}"></div><div class="form-group"><label>Contact Number</label><input id="modalField4" value="${item.phone}"></div>`;
  if (type === "experience")
    fields = `<div class="form-group"><label>Company</label><input id="modalField1" value="${item.company}"></div><div class="form-group"><label>Designation</label><input id="modalField2" value="${item.designation}"></div><div class="form-group"><label>Years</label><input id="modalField3" value="${item.years}"></div><div class="form-group"><label>Location</label><input id="modalField4" value="${item.location}"></div>`;
  document.getElementById("modalTitle").innerText = `Edit ${type}`;
  document.getElementById("modalBody").innerHTML = fields;
  document.getElementById("modalOverlay").classList.add("active");
}

function renderDocumentsUI() {
  let container = document.getElementById("documentsContainer");
  if (!container) return;
  let categories = [
    {
      name: "Identity",
      icon: "fa-id-card",
      docs: ["Aadhaar Card", "PAN Card"],
    },
    {
      name: "Professional",
      icon: "fa-graduation-cap",
      docs: ["Degree Certificate", "Experience Letter"],
    },
  ];
  let html = "";
  categories.forEach((cat) => {
    let uploadedCount = cat.docs.filter((d) => documents[d]?.uploaded).length;
    html += `<div class="doc-category"><div class="doc-category-header"><h3><i class="fas ${cat.icon}"></i> ${cat.name}</h3><span class="doc-count-badge">${uploadedCount}/${cat.docs.length}</span></div>`;
    cat.docs.forEach((doc) => {
      let data = documents[doc];
      let isUp = data?.uploaded;
      html += `<div class="doc-item"><div class="doc-info"><div class="doc-icon"><i class="fas fa-file-pdf"></i></div><div><h4>${doc}</h4><span class="doc-status-badge ${isUp ? "uploaded" : "pending"}">${isUp ? "Uploaded" : "Pending"}</span>${isUp ? `<div class="doc-filename"><small>${data.name}</small></div>` : ""}</div></div><div class="doc-actions-buttons"><button class="doc-action-btn upload" data-doc="${doc}"><i class="fas fa-upload"></i> ${isUp ? "Replace" : "Upload"}</button>${isUp ? `<button class="doc-action-btn view" data-doc="${doc}"><i class="fas fa-eye"></i> View</button><button class="doc-action-btn delete" data-doc="${doc}"><i class="fas fa-trash"></i> Delete</button>` : ""}</div></div>`;
    });
    html += `</div>`;
  });
  container.innerHTML = html;
  attachDocEvents();
}

function attachDocEvents() {
  document
    .querySelectorAll(".doc-action-btn.upload")
    .forEach((btn) =>
      btn.addEventListener("click", () => openFileUploadModal(btn.dataset.doc)),
    );
  document.querySelectorAll(".doc-action-btn.view").forEach((btn) =>
    btn.addEventListener("click", () => {
      let doc = btn.dataset.doc;
      if (documents[doc]?.url) window.open(documents[doc].url, "_blank");
      else showErrorToast("No file");
    }),
  );
  document.querySelectorAll(".doc-action-btn.delete").forEach((btn) =>
    btn.addEventListener("click", () => {
      let doc = btn.dataset.doc;
      if (confirm("Delete document?")) {
        if (documents[doc]?.url) URL.revokeObjectURL(documents[doc].url);
        documents[doc] = {
          uploaded: false,
          name: "",
          size: 0,
          url: null,
        };
        renderDocumentsUI();
        showSuccessToast(`${doc} deleted`);
      }
    }),
  );
}

function openFileUploadModal(docName) {
  document.getElementById("modalTitle").innerHTML = `Upload ${docName}`;
  document.getElementById("modalBody").innerHTML =
    `<div class="dropzone" id="dropzone"><i class="fas fa-cloud-upload-alt fa-2x"></i><p>Drag & drop or click to select</p><input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none"></div><div id="fileInfo"></div>`;
  document.getElementById("modalOverlay").classList.add("active");
  let dropzone = document.getElementById("dropzone"),
    fileInput = document.getElementById("fileInput");
  dropzone.onclick = () => fileInput.click();
  fileInput.onchange = (e) => handleDocUpload(e.target.files[0], docName);
  dropzone.ondragover = (e) => e.preventDefault();
  dropzone.ondrop = (e) => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    handleDocUpload(file, docName);
  };
}

function handleDocUpload(file, docName) {
  if (!file) return;
  if (!file.type.match(/pdf|jpeg|jpg|png/i)) {
    showErrorToast("Only PDF/JPG/PNG");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showErrorToast("Max 5MB");
    return;
  }
  let url = URL.createObjectURL(file);
  if (documents[docName]?.url) URL.revokeObjectURL(documents[docName].url);
  documents[docName] = {
    uploaded: true,
    name: file.name,
    size: file.size,
    url: url,
  };
  renderDocumentsUI();
  document.getElementById("modalOverlay").classList.remove("active");
  showSuccessToast(`${docName} uploaded successfully!`);
}

function attachStepEvents() {
  if (currentStep === 1) {
    let cb = document.getElementById("pwdCheckbox");
    let pwdDiv = document.getElementById("pwdFields");
    if (cb)
      cb.addEventListener(
        "change",
        (e) => (pwdDiv.style.display = e.target.checked ? "grid" : "none"),
      );
  }
  if (currentStep === 3) {
    let copyBtn = document.getElementById("copyAddressBtn");
    if (copyBtn)
      copyBtn.addEventListener("click", () => {
        document.getElementById("perStreet").value =
          document.getElementById("curStreet").value;
        document.getElementById("perCity").value =
          document.getElementById("curCity").value;
        document.getElementById("perPin").value =
          document.getElementById("curPin").value;
        showSuccessToast("Address copied");
      });
  }
  if (currentStep === 4) {
    document
      .getElementById("addEduBtn")
      ?.addEventListener("click", () => openAddModal("education"));
    document
      .getElementById("addFamilyBtn")
      ?.addEventListener("click", () => openAddModal("family"));
    document
      .getElementById("addExpBtn")
      ?.addEventListener("click", () => openAddModal("experience"));
    renderDynamicLists();
  }
  if (currentStep === 5) renderDocumentsUI();
}

function openAddModal(type) {
  currentModalType = type;
  currentEditIndex = null;
  let fields = "";
  if (type === "education")
    fields = `<div class="form-group"><label>Degree</label><input id="modalField1"></div><div class="form-group"><label>Institute</label><input id="modalField2"></div><div class="form-group"><label>Year</label><input id="modalField3"></div><div class="form-group"><label>Percentage/CGPA</label><input id="modalField4"></div>`;
  if (type === "family")
    fields = `<div class="form-group"><label>Name</label><input id="modalField1"></div><div class="form-group"><label>Relationship</label><input id="modalField2"></div><div class="form-group"><label>Occupation</label><input id="modalField3"></div><div class="form-group"><label>Phone</label><input id="modalField4"></div>`;
  if (type === "experience")
    fields = `<div class="form-group"><label>Company</label><input id="modalField1"></div><div class="form-group"><label>Designation</label><input id="modalField2"></div><div class="form-group"><label>Years</label><input id="modalField3"></div><div class="form-group"><label>Location</label><input id="modalField4"></div>`;
  document.getElementById("modalTitle").innerText = `Add ${type}`;
  document.getElementById("modalBody").innerHTML = fields;
  document.getElementById("modalOverlay").classList.add("active");
}

function saveModalEntry() {
  if (currentModalType === "education") {
    let obj = {
      degree: document.getElementById("modalField1")?.value,
      institute: document.getElementById("modalField2")?.value,
      year: document.getElementById("modalField3")?.value,
      percentage: document.getElementById("modalField4")?.value,
    };
    if (currentEditIndex !== null) educationList[currentEditIndex] = obj;
    else educationList.push(obj);
    renderDynamicLists();
    showSuccessToast("Education saved");
  }
  if (currentModalType === "family") {
    let obj = {
      name: document.getElementById("modalField1")?.value,
      relationship: document.getElementById("modalField2")?.value,
      occupation: document.getElementById("modalField3")?.value,
      phone: document.getElementById("modalField4")?.value,
    };
    if (currentEditIndex !== null) familyList[currentEditIndex] = obj;
    else familyList.push(obj);
    renderDynamicLists();
    showSuccessToast("Family saved");
  }
  if (currentModalType === "experience") {
    let obj = {
      company: document.getElementById("modalField1")?.value,
      designation: document.getElementById("modalField2")?.value,
      years: document.getElementById("modalField3")?.value,
      location: document.getElementById("modalField4")?.value,
    };
    if (currentEditIndex !== null) experienceList[currentEditIndex] = obj;
    else experienceList.push(obj);
    renderDynamicLists();
    showSuccessToast("Experience saved");
  }
  document.getElementById("modalOverlay").classList.remove("active");
}

// Event listeners & UI init
document.getElementById("nextBtn").onclick = () => {
  if (!validateStep(currentStep)) return;

  // STEP 1 to 4 → normal next
  if (currentStep < 5) {
    currentStep++;
    renderCurrentStep();
    updateStepperUI();
    updateNextButtonUI();
  }
  // STEP 5 → SAVE ACTION
  else {
    saveFinalForm();
  }
};

function saveFinalForm() {
  // collect all final data here if needed
  console.log("Final form data saved");

  showSuccessToast("Profile saved successfully!");
}

//Button UI Switch Function
function updateNextButtonUI() {
  const nextBtn = document.getElementById("nextBtn");

  if (currentStep === 5) {
    nextBtn.innerHTML = `<i class="fas fa-save"></i> Save`;
    nextBtn.classList.add("btn-save-style"); // optional
  } else {
    nextBtn.innerHTML = `Next <i class="fas fa-arrow-right"></i>`;
    nextBtn.classList.remove("btn-save-style");
  }
}

document.getElementById("prevBtn").onclick = () => {
  if (currentStep > 1) {
    currentStep--;
    renderCurrentStep();
    updateStepperUI();
  }
};
document.getElementById("editModeBtn").onclick = () => {
  isEditMode = true;
  updateEditModeUI();
};
document.getElementById("saveModeBtn").onclick = () => {
  isEditMode = false;
  updateEditModeUI();
  showSuccessToast("Profile changes saved");
};
document.getElementById("cancelModeBtn").onclick = () => {
  isEditMode = false;
  updateEditModeUI();
  renderCurrentStep();
};
document.getElementById("cancelModalBtn").onclick = () =>
  document.getElementById("modalOverlay").classList.remove("active");
document.getElementById("saveModalBtn").onclick = saveModalEntry;
// Sidebar logic
document.getElementById("collapseSidebarBtn").onclick = () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
  document.getElementById("mainContent").classList.toggle("sidebar-collapsed");
};
document.getElementById("mobileToggleBtn").onclick = () =>
  document.getElementById("sidebar").classList.toggle("mobile-open");
// ==================== PROFILE DROPDOWN FUNCTIONALITY ====================

const profileDropdownBtn = document.getElementById("profileDropdownBtn");
const profileDropdown = document.getElementById("profileDropdown");

if (profileDropdownBtn && profileDropdown) {
  profileDropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    profileDropdown.classList.toggle("active");
  });
}

// Close when clicking outside
document.addEventListener("click", function (e) {
  if (profileDropdown && !profileDropdownBtn.contains(e.target)) {
    profileDropdown.classList.remove("active");
  }
});

// Close on ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && profileDropdown) {
    profileDropdown.classList.remove("active");
  }
});
// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
      // Replace with your actual logout logic
      window.location.href = "../index.html";
    }
  });
}
// initial
renderStepper();
renderCurrentStep();
updateNextButtonUI();
disableAllFields();
isEditMode = false;
updateEditModeUI();
