  // Аккордеон лист для блоков меню с плавным раскрытием
  const headers = document.querySelectorAll('.menu-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const isActive = header.classList.contains('active');
      headers.forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.classList.remove('active');
      });
      if (!isActive) {
        header.classList.add('active');
        header.nextElementSibling.classList.add('active');
      }
    });
  });

  // Ваш основной JS код с обработчиками под вашу логику с QR-code

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: "https://example.com",
    dotsOptions: {
      color: "#000000",
      type: "square"
    },
    cornersSquareOptions: {
      type: "square",
      color: "#000000"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000000"
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    margin: 5,
    qrOptions: {
      errorCorrectionLevel: "M"
    }
  });

  const container = document.getElementById("qr-code");
  qrCode.append(container);

  const urlInput = document.getElementById("urlInput");
  const dotColor = document.getElementById("dotColor");
  const dotColorHex = document.getElementById("dotColorHex");
  const bgColor = document.getElementById("bgColor");
  const bgColorHex = document.getElementById("bgColorHex");
  const bgTransparency = document.getElementById("bgTransparency");
  const dotShape = document.getElementById("dotShape");
  const markerShape = document.getElementById("markerShape");
  const logoInput = document.getElementById("logoInput");
  const logoFile = document.getElementById("logoFile");
  const logoPreview = document.getElementById("logoPreview");
  const removeLogoBtn = document.getElementById("removeLogo");
  const logoSize = document.getElementById("logoSize");
  const errorLevel = document.getElementById("errorLevel");
  const logoOverlay = document.getElementById("logoOverlay");
  const exportButtons = document.getElementById("exportButtons");
  const seedArea = document.getElementById("seedArea");
  const copySettingsBtn = document.getElementById("copySettings");
  const loadSettingsBtn = document.getElementById("loadSettingsBtn");
  const messageBox = document.getElementById("messageBox");

  let updateTimer;
  let logoData;

  function showMessage(message, isError = false) {
    messageBox.textContent = message;
    if (isError) {
      messageBox.classList.add("error");
    } else {
      messageBox.classList.remove("error");
    }
    messageBox.style.opacity = "1";
    messageBox.style.pointerEvents = "auto";
    setTimeout(() => {
      messageBox.style.opacity = "0";
      messageBox.style.pointerEvents = "none";
    }, 3000);
  }

  function syncColorInputs(colorInput, hexInput) {
    colorInput.addEventListener("input", () => {
      hexInput.value = colorInput.value;
    });
    hexInput.addEventListener("input", () => {
      const val = hexInput.value.trim();
      if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
        colorInput.value = val;
        updateQR();
      }
    });
  }

  function updateLogoOverlay() {
    if (logoData) {
      logoOverlay.src = logoData;
      logoOverlay.style.display = "block";
      let sizePerc = parseFloat(logoSize.value);
      sizePerc = Math.min(Math.max(sizePerc, 1), 50);
      logoOverlay.style.maxWidth = sizePerc + "%";
      logoOverlay.style.height = "auto";
    } else {
      logoOverlay.style.display = "none";
    }
  }

  function updateQR() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      const data = urlInput.value.trim();
      if (!data) return;
      qrCode.update({
        data: data,
        dotsOptions: { color: dotColor.value, type: dotShape.value },
        cornersSquareOptions: { type: markerShape.value, color: dotColor.value },
        cornersDotOptions: { type: markerShape.value, color: dotColor.value },
        backgroundOptions: { color: bgTransparency.checked ? "transparent" : bgColor.value },
        qrOptions: { errorCorrectionLevel: errorLevel.value },
      });
      updateLogoOverlay();
      const settings = {
        data,
        dotColor: dotColor.value,
        dotColorHex: dotColorHex.value,
        bgColor: bgColor.value,
        bgColorHex: bgColorHex.value,
        bgTransparency: bgTransparency.checked,
        dotShape: dotShape.value,
        markerShape: markerShape.value,
        logoUrl: logoInput.value,
        logoBase64: logoData,
        logoSize: logoSize.value,
        errorLevel: errorLevel.value,
      };
      seedArea.value = btoa(JSON.stringify(settings));
      exportButtons.style.display = "flex";
    }, 500);
  }

  syncColorInputs(dotColor, dotColorHex);
  syncColorInputs(bgColor, bgColorHex);

  logoInput.addEventListener("input", () => {
    if (logoInput.value.trim() !== "") {
      logoData = logoInput.value.trim();
      logoPreview.style.display = "none";
      removeLogoBtn.style.display = logoData ? "inline-block" : "none";
      updateQR();
    } else if (!logoData) {
      removeLogoBtn.style.display = "none";
    }
  });

  logoFile.addEventListener("change", () => {
    const file = logoFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoData = e.target.result;
      logoPreview.src = logoData;
      logoPreview.style.display = "block";
      removeLogoBtn.style.display = "inline-block";
      logoInput.value = "";
      updateQR();
    };
    reader.readAsDataURL(file);
  });

  removeLogoBtn.addEventListener("click", () => {
    logoData = undefined;
    logoPreview.style.display = "none";
    removeLogoBtn.style.display = "none";
    logoFile.value = "";
    logoInput.value = "";
    updateQR();
  });

  copySettingsBtn.addEventListener("click", () => {
    seedArea.select();
    try {
      document.execCommand("copy");
      showMessage("Код настроек скопирован в буфер обмена");
    } catch {
      showMessage("Ошибка копирования", true);
    }
    window.getSelection().removeAllRanges();
  });

  loadSettingsBtn.addEventListener("click", () => {
    try {
      const jsonStr = atob(seedArea.value);
      const settings = JSON.parse(jsonStr);
      urlInput.value = settings.data || "https://example.com";
      dotColor.value = settings.dotColor || "#000000";
      dotColorHex.value = settings.dotColorHex || dotColor.value;
      bgColor.value = settings.bgColor || "#ffffff";
      bgColorHex.value = settings.bgColorHex || bgColor.value;
      bgTransparency.checked = settings.bgTransparency || false;
      dotShape.value = settings.dotShape || "square";
      markerShape.value = settings.markerShape || "square";
      logoInput.value = settings.logoUrl || "";
      logoData = settings.logoBase64 || undefined;
      if (logoData) {
        if (logoData.startsWith("data:image")) {
          logoPreview.src = logoData;
          logoPreview.style.display = "block";
          removeLogoBtn.style.display = "inline-block";
          logoInput.value = "";
        } else {
          logoPreview.style.display = "none";
          removeLogoBtn.style.display = "inline-block";
          logoInput.value = logoData;
        }
      } else {
        logoPreview.style.display = "none";
        removeLogoBtn.style.display = "none";
      }
      logoFile.value = "";
      logoSize.value = settings.logoSize || 15;
      errorLevel.value = settings.errorLevel || "M";

      updateQR();
      showMessage("Код настроек успешно вставлен");
    } catch (e) {
      showMessage("Некорректный код настроек", true);
    }
  });

  urlInput.addEventListener("input", updateQR);
  dotColor.addEventListener("input", () => {
    dotColorHex.value = dotColor.value;
    updateQR();
  });
  dotColorHex.addEventListener("input", () => {
    if (/^#([0-9A-Fa-f]{6})$/.test(dotColorHex.value)) {
      dotColor.value = dotColorHex.value;
      updateQR();
    }
  });
  bgColor.addEventListener("input", () => {
    bgColorHex.value = bgColor.value;
    updateQR();
  });
  bgColorHex.addEventListener("input", () => {
    if (/^#([0-9A-Fa-f]{6})$/.test(bgColorHex.value)) {
      bgColor.value = bgColorHex.value;
      updateQR();
    }
  });
  bgTransparency.addEventListener("change", updateQR);
  dotShape.addEventListener("change", updateQR);
  markerShape.addEventListener("change", updateQR);
  errorLevel.addEventListener("change", updateQR);

  exportButtons.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const ext = btn.getAttribute("data-type");
      qrCode.download({ extension: ext, name: "qr-code" });
    });
  });

  updateQR();