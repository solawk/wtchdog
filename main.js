let lastId = -1;
let lastTime = 0;

let isFetching = false;

setInterval(() =>
{
    if (isFetching)
    {
        fetchLog();
    }
}, 500);

async function fetchLog()
{
    try
    {
        const ip = document.getElementById("ip").value;
        const data = await(fetch("http://" + ip + ":8111/hudmsg?lastEvt=-1&lastDmg=" + lastId.toString()));
        const reader = await(data.body.getReader().read());
        const str = new TextDecoder().decode(reader.value);

        const json = JSON.parse(str);
        if (json.damage.length === 0) return;

        for (const d of json.damage)
        {
            //console.log(d);
            processDamage(d.msg, d.time);
        }

        lastId = json.damage[json.damage.length - 1].id;
    }
    catch (e)
    {
        console.log(e.message);
        alert(e.message);
    }
}

function processDamage(dmg, time)
{
    // Time
    if (time < lastTime)
    {
        // Trigger a reset
        console.log("RESET");
        players.clear();
        clearTable();
    }
    lastTime = time;

    let type = null;
    let divider = null;

    for (const m of msgDestroyed) if (!divider && dmg.includes(m)) { divider = m; type = "kill"; };
    for (const m of msgFire) if (!divider && dmg.includes(m)) { divider = m; type = "fire"; };
    for (const m of msgWrecked) if (!divider && dmg.includes(m)) { divider = m; type = "suicide"; };
    for (const m of msgCrashed) if (!divider && dmg.includes(m)) { divider = m; type = "suicide"; };

    if (!type) return;

    const agents = dmg.split(divider);
    agents[0] = agents[0].trim();
    agents[1] = agents[1].trim();

    for (let i = 0; i < agents.length; i++)
    {
        const vehicleStart = agents[i].indexOf('(');
        const vehicle = agents[i].substring(vehicleStart + 1, agents[i].length - 1);
        const player = agents[i].substring(0, vehicleStart - 1);

        if (player.length === 0)    if (type !== "suicide") return; else agents[i] = null;
        else                        agents[i] = [player, vehicle];
    }

    switch (type)
    {
        case "kill":
        console.log(agents[0][0] + " (" + agents[0][1] + ") killed " + agents[1][0] + " (" + agents[1][1] + ")");
        kill(agents[0], agents[1]);
        break;
     
        case "fire":
        console.log(agents[0][0] + " (" + agents[0][1] + ") set on fire " + agents[1][0] + " (" + agents[1][1] + ")");
        fire(agents[0], agents[1]);
        break;
     
        case "suicide":
        console.log(agents[0][0] + " (" + agents[0][1] + ") suicided");
        suicide(agents[0], agents[1]);
        break;
    }

}