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

    const evaluate = (func, x) => {
        return math.evaluate(func, { x: x });
    };

    let iterCount = 0;
    let mid = 0;

    let aCurrent = a;
    let bCurrent = b;
    let prevMid = null;

    if (evaluate(funcInput, aCurrent) * evaluate(funcInput, bCurrent) > 0) {
        alert("No hay cambio de signo en el intervalo proporcionado.");
        return;
    }

    while ((bCurrent - aCurrent) / 2 > tolerance) {
        mid = (aCurrent + bCurrent) / 2;
        iterCount++;

        const fMid = evaluate(funcInput, mid);
        const fA = evaluate(funcInput, aCurrent);
        const fB = evaluate(funcInput, bCurrent);

        let error = prevMid !== null ? Math.abs(mid - prevMid) : "-";
        prevMid = mid;

        // Crear una fila para la tabla
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${iterCount}</td>
            <td>${aCurrent.toFixed(precision)}</td>
            <td>${bCurrent.toFixed(precision)}</td>
            <td>${fA.toFixed(precision)}</td>
            <td>${fB.toFixed(precision)}</td>
            <td>${mid.toFixed(precision)}</td>
            <td>${fMid.toFixed(precision)}</td>
            <td>${error !== "-" ? error.toFixed(precision) : error}</td>
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
