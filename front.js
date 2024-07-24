function createPlayerEntry(p)
{
    const tr = document.createElement("tr");
    document.getElementById("playerTable").appendChild(tr);

    const tdName = document.createElement("td");
    const tdVehicle = document.createElement("td");

    tr.appendChild(tdName);
    tr.appendChild(tdVehicle);

    tdName.innerHTML = p[0];
    tdName.style.textAlign = "right";

    tdVehicle.innerHTML = p[1];

    return tr;
}

function clearTable()
{
    const table = document.getElementById("playerTable");

    for (const tr of table.childNodes)
    {
        table.removeChild(tr);
    }
}