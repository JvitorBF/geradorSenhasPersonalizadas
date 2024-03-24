let inputsRadio = document.querySelectorAll('input[type="radio"]');
let checkboxRadio = Array.from(
  document.querySelectorAll('input[type="checkbox"]')
);
let inputSenha = document.getElementById("senha");
let tamanho = document.getElementById("rangeBar");
let visor = document.getElementById("senha");
const permitir_sequencia = document.getElementById("sequencia");

/* Integração do rangeBar com o rangeValueDisplay */
tamanho.addEventListener("input", function (e) {
  let rangeValue = e.target.value;
  let valueDisplay = document.getElementById("rangeDisplay");
  valueDisplay.value = rangeValue;
  geradorDeSenha(tamanho.value, getCategorias(), permitir_sequencia.checked);
});

window.addEventListener("load", function () {
  document.getElementById("pronunciar").click();
});

function geradorDeSenha(tamanho, categorias, permitirRepeticao) {
  const categoriasPossiveis = {
    maiuscula: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    minuscula: "abcdefghijklmnopqrstuvwxyz",
    numeros: "0123456789",
    simbolos: "!@#$%^&*()-=_+[]{}|;:,.<>?",
  };

  let caracteresDisponiveis = "";

  categorias.forEach((categoria) => {
    if (categoriasPossiveis[categoria]) {
      caracteresDisponiveis += categoriasPossiveis[categoria];
    }
  });

  const lerSelecionado = document.getElementById("ler").checked;
  console.log(lerSelecionado);
  // Se "ler" estiver selecionado, remova caracteres ambíguos
  if (lerSelecionado) {
    caracteresDisponiveis = caracteresDisponiveis.replace(/[Iil10Oo]/g, "");
  }

  let senha = "";
  let ultimoCaractere = "";

  for (let i = 0; i < tamanho; i++) {
    let randomIndex;
    let novoCaractere;

    do {
      randomIndex = Math.floor(Math.random() * caracteresDisponiveis.length);
      novoCaractere = caracteresDisponiveis[randomIndex];
    } while (!permitirRepeticao && novoCaractere === ultimoCaractere);

    senha += novoCaractere;
    ultimoCaractere = novoCaractere;
  }

  visor.value = senha;
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

function valueRadioSelecionado() {
  let radioSelecionado = document.querySelector('input[type="radio"]:checked');
  if (radioSelecionado) {
    return radioSelecionado.value;
  } else {
    return null;
  }
}

function atualizarCheckBoxes(valueCheckbox, status) {
  checkboxRadio.forEach(function (checkbox) {
    if (valueCheckbox.includes(checkbox.value)) {
      checkbox.checked = status;
    }
  });
}

/* True destiva e False ativa o checkbox  */
function ativarDestivarCheckBoxes(valueCheckbox, status) {
  checkboxRadio.forEach(function (checkbox) {
    if (valueCheckbox.includes(checkbox.value)) {
      checkbox.disabled = status;
    }
  });
}

function getCategorias() {
  return checkboxRadio
    .filter((chk) => chk.checked)
    .map((checkbox) => checkbox.id);
}

inputsRadio.forEach(function (input) {
  input.addEventListener("change", function () {
    let value = valueRadioSelecionado();
    atualizarCheckBoxes(
      ["maiuscula", "minuscula", "numeros", "simbolos"],
      true
    );
    ativarDestivarCheckBoxes(
      ["maiscula", "minuscula", "numeros", "simbolos"],
      false
    );

    if (value === "pronunciar") {
      console.log("Checkbox maiuscula e minuscula ativos, resto desativado");
      atualizarCheckBoxes(["numeros", "simbolos"], false);
      ativarDestivarCheckBoxes(["numeros", "simbolos"], true);
    }

    if (value === "ler") {
      atualizarCheckBoxes(["simbolos"], false);
      ativarDestivarCheckBoxes(["simbolos"], true);
      ativarDestivarCheckBoxes(["numeros"], false);
    }

    geradorDeSenha(tamanho.value, getCategorias(), permitir_sequencia.checked);
  });
});
/* 
function handleEventListener() {
  let inputRadio = document.getElementsByName("facilidade");
  inputRadio.forEach((input) => {
    input.addEventListener("change", function (e) {
      geradorDeSenha(tamanho.value, getCategorias(), permitir_sequencia.checked);
    });
  });
} */

const copyButton = document.getElementById("copy-button");
copyButton.addEventListener("click", () => {
  const passwordElement = document.getElementById("senha");
  passwordElement.select();
  document.execCommand("copy");
});
