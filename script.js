/*jslint browser */

// Цены задаются в виде JSON-подобного объекта.
const PRICES = {
    services: {
        basic: {
            base: 1000
        },
        standard: {
            base: 1500,
            options: {
                normal: 0,
                fast: 500,
                urgent: 1000
            }
        },
        premium: {
            base: 2500,
            property: 700
        }
    }
};

const form = document.getElementById("calc-form");
const quantityInput = document.getElementById("quantity");
const quantityError = document.getElementById("quantity-error");
const optionsBlock = document.getElementById("options-block");
const optionsSelect = document.getElementById("options");
const propertyBlock = document.getElementById("property-block");
const propertyCheckbox = document.getElementById("property");
const priceOutput = document.getElementById("price");

function getSelectedService() {
    return form.elements.service.value;
}

// Возвращает количество или null, если введено некорректное значение.
function getQuantity() {
    const value = Number(quantityInput.value);
    if (quantityInput.value.trim() === "" || !Number.isInteger(value) || value < 1) {
        return null;
    }
    return value;
}

function formatPrice(value) {
    return value.toLocaleString("ru-RU") + " ₽";
}

// Показывает или скрывает опцию/свойство в зависимости от типа услуги.
function updateVisibility() {
    const service = PRICES.services[getSelectedService()];
    optionsBlock.hidden = service.options === undefined;
    propertyBlock.hidden = service.property === undefined;
}

function calculate() {
    const service = PRICES.services[getSelectedService()];
    const quantity = getQuantity();
    let unitPrice = service.base;

    if (quantity === null) {
        quantityError.hidden = false;
        priceOutput.textContent = "—";
        return;
    }
    quantityError.hidden = true;

    if (service.options !== undefined) {
        unitPrice += service.options[optionsSelect.value];
    }
    if (service.property !== undefined && propertyCheckbox.checked) {
        unitPrice += service.property;
    }
    priceOutput.textContent = formatPrice(unitPrice * quantity);
}

function onServiceChange() {
    updateVisibility();
    calculate();
}

document.addEventListener("DOMContentLoaded", function () {
    quantityInput.addEventListener("input", calculate);
    optionsSelect.addEventListener("change", calculate);
    propertyCheckbox.addEventListener("change", calculate);
    form.querySelectorAll("input[name=service]").forEach(function (radio) {
        radio.addEventListener("change", onServiceChange);
    });
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });
    onServiceChange();
});
