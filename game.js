let playerName = "";
const players = new Map();

function checkaddPlayer(p)
{
    if (!players.has(p[0]))
    {
        players.set(p[0],
        {
            vehicle: p[1],
            side: 0, // 0 - unknown, 1 - blue, 2 - red
            fires: 0,
            dead: false,
            tr: createPlayerEntry(p)
        });
    }
}

function setVehicle(p)
{
    players.get(p[0]).vehicle = p[1];
    players.get(p[0]).dead = false;
}

function setSide(p, s)
{
    players.get(p[0]).side = s;
}

function addFire(p)
{
    players.get(p[0]).fires++;
}

function commitDie(p)
{
    players.get(p[0]).dead = true;
    players.get(p[0]).fires = 0;
}

function kill(a, b)
{
    checkaddPlayer(a);
    checkaddPlayer(b);

    setVehicle(a);
    setVehicle(b);

    commitDie(b);
}

function fire(a, b)
{
    checkaddPlayer(a);
    checkaddPlayer(b);

    setVehicle(a);
    setVehicle(b);

    addFire(b);
}

function suicide(a)
{
    checkaddPlayer(a);

    setVehicle(a);

    commitDie(a);
}