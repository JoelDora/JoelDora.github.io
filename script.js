document.getElementById("bisectionForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const funcInput = document.getElementById("function").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const toleranceInput = document.getElementById("tolerance").value;
    const precision = parseInt(document.getElementById("precision").value);

    let tolerance = parseFloat(toleranceInput);
    if (isNaN(tolerance) || tolerance <= 0) {
        alert("Por favor, ingresa una tolerancia válida (ej. 0.0000001).");
        return;
    }

    const resultsTable = document.querySelector("#resultsTable tbody");
    resultsTable.innerHTML = ""; // Limpiar la tabla

    // Validar la función
    try {
        math.evaluate(funcInput, { x: 1 });
    } catch (error) {
        alert("La función ingresada no es válida. Por favor verifica el formato.");
        return;
    }

    const evaluate = (func, x) => {
        try {
            return math.evaluate(func, { x: x });
        } catch (error) {
            alert("Error al evaluar la función. Revisa el intervalo.");
            throw error;
        }
    };

    let iterCount = 0;
    let mid = 0;
    let aCurrent = a;
    let bCurrent = b;
    let prevMid = null;

    // Validar el intervalo
    if (evaluate(funcInput, aCurrent) * evaluate(funcInput, bCurrent) > 0) {
        alert("No hay cambio de signo en el intervalo proporcionado.");
        return;
    }

    const maxIterations = 1000; // Límite máximo de iteraciones
    while ((bCurrent - aCurrent) / 2 > tolerance) {
        if (iterCount >= maxIterations) {
            alert("El cálculo excedió el número máximo de iteraciones permitidas.");
            break;
        }

        mid = (aCurrent + bCurrent) / 2;
        iterCount++;

        const fMid = evaluate(funcInput, mid);
        const fA = evaluate(funcInput, aCurrent);
        const fB = evaluate(funcInput, bCurrent);

        let error = prevMid !== null ? Math.abs(mid - prevMid) : "-";
        prevMid = mid;

        const displayedPrecision = Math.min(precision, 10);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${iterCount}</td>
            <td>${aCurrent.toFixed(displayedPrecision)}</td>
            <td>${bCurrent.toFixed(displayedPrecision)}</td>
            <td>${fA.toFixed(displayedPrecision)}</td>
            <td>${fB.toFixed(displayedPrecision)}</td>
            <td>${mid.toFixed(displayedPrecision)}</td>
            <td>${fMid.toFixed(displayedPrecision)}</td>
            <td>${error !== "-" ? error.toFixed(displayedPrecision) : error}</td>
        `;
        resultsTable.appendChild(row);

        if (fMid === 0) {
            break;
        } else if (fA * fMid < 0) {
            bCurrent = mid;
        } else {
            aCurrent = mid;
        }
    }

    alert(`Cálculo finalizado en ${iterCount} iteraciones con una tolerancia de ${toleranceInput}.`);
});

document.getElementById("precision").addEventListener("input", function (event) {
    document.getElementById("precisionValue").textContent = event.target.value;
});
document.getElementById("clearButton").addEventListener("click", function () {
    // Limpiar los campos del formulario
    document.getElementById("function").value = "";
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("tolerance").value = "";
    document.getElementById("precision").value = 10; // Restablecer a valor predeterminado
    document.getElementById("precisionValue").textContent = "10"; // Actualizar visualmente el rango

    // Limpiar los resultados de la tabla
    const resultsTable = document.querySelector("#resultsTable tbody");
    resultsTable.innerHTML = "";

    console.log("Formulario y resultados limpiados.");
});
