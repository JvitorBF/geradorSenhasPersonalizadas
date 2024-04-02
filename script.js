function passwordGenerator(tamanho, categories) {
  const categoriasPossiveis = {
    maiuscula: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    minuscula: "abcdefghijklmnopqrstuvwxyz",
    numeros: "0123456789",
    simbolos: "!@#$%^&*()-=_+[]{}|;:,.<>?",
  };

  let availableCharacters = "";

  for (const category in categories) {
    if (category === "permitirSequencia" && categories[category]) {
      break;
    }
    if (categories[category]) {
      availableCharacters += categoriasPossiveis[category];
    }
  }

  const lerSelecionado = document.getElementById("ler").checked;
  // Se "ler" estiver selecionado, remova caracteres ambíguos
  if (lerSelecionado) {
    availableCharacters = availableCharacters.replace(/[Iil10Oo]/g, "");
  }

  let senha = "";
  let ultimoCaractere = "";

  for (let i = 0; i < tamanho; i++) {
    let randomIndex;
    let novoCaractere;

    do {
      randomIndex = Math.floor(Math.random() * availableCharacters.length);
      novoCaractere = availableCharacters[randomIndex];
    } while (
      !categories["permitirSequencia"] &&
      novoCaractere === ultimoCaractere
    );

    senha += novoCaractere;
    ultimoCaractere = novoCaractere;
  }

  let passwordElement = document.getElementById("password");
  passwordElement.value = senha;
  updateProgressBar(calculatePasswordStrength(senha));
  return senha;
}

const updateProgressBar = (strength) => {
  const progressBar = document.getElementById("bar");
  const percentual = `${100 - strength}%`;

  console.log(percentual);
  progressBar.style.width = percentual;
};

const calculatePasswordStrength = (password) => {
  let strength = 0;

  const charsets = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    numbers: /[0-9]/,
    symbols: /[-!$%^&*()_+|~=`{}\[\]:";'<>?,./]/,
  };

  const lengths = [8, 12, 16, 20, 26];
  for (const length of lengths) {
    if (password.length >= length) {
      strength += 10;
    }
  }

  for (const charset of Object.values(charsets)) {
    if (charset.test(password)) {
      strength += 10;
    }
  }

  if (!/(.)\1{2}/.test(password)) {
    strength += 10;
  }

  return strength;
};

const HandleCategoriesCheckbox = (categoryValue) => {
  const categoryElements = document.querySelectorAll(
    'input[type="checkbox"][name="categoria"]'
  );
  categoryElements.forEach(function (checkbox) {
    checkbox.checked = categoryValue[checkbox.value];
  });
};

const getCategories = () => {
  const facility = document.querySelector(
    "input[name=facilidade]:checked"
  ).value;

  const categories = {
    maiuscula: true,
    minuscula: true,
    numeros: true,
    simbolos: true,
    permitirSequencia: true,
  };

  if (facility === "pronunciar") {
    categories.numeros = false;
    categories.simbolos = false;
  }

  if (facility === "ler") {
    categories.simbolos = false;
  }
  const allowRepeat = document.getElementById("permitirSequencia");
  categories[allowRepeat.id] = allowRepeat.checked;
  HandleCategoriesCheckbox(categories);
  return categories;
};

const HandleEventListener = () => {
  const lengthBar = document.getElementById("rangeBar");
  lengthBar.addEventListener("input", () => {
    const lengthDisplay = document.getElementById("rangeDisplay");
    let length = lengthBar.value;
    lengthDisplay.value = length;
    passwordGenerator(lengthBar.value, getCategories());
  });

  const facilityElements = document.querySelectorAll(
    'input[type="radio"][name="facilidade"]'
  );
  facilityElements.forEach((radioButton) => {
    radioButton.addEventListener("change", () => {
      passwordGenerator(lengthBar.value, getCategories());
    });
  });

  const categoryElements = document.querySelectorAll(
    'input[type="checkbox"][name="categoria"]'
  );
  categoryElements.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      passwordGenerator(lengthBar.value, getCategories());
    });
  });

  const copyButton = document.getElementById("copy-button");
  copyButton.addEventListener("click", () => {
    const passwordElement = document.getElementById("password");
    passwordElement.select();
    document.execCommand("copy");
  });
};

const onInit = () => {
  HandleEventListener();
  passwordGenerator(10, getCategories());
};

window.addEventListener("load", function () {
  document.getElementById("pronunciar").click();
  onInit();
});
