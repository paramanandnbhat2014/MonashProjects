var lvlNo = 10;
var elevatorPerLvl = 4;
var elevatorCapacity = 2;
var mainCanvas = null;
var elevatorHeight = 100;
var elevatorWidth = 50;
var elevators = []; // empty array

$(document).ready(function() {
    txt = "";
    for (i = 0; i < elevatorPerLvl; i++)
    {
        elevators.push({lvl: 0, dir: 0, personsNo: 0 ,stopList:[]});
    }
    for (i = 0; i < lvlNo; i++)
    {
        txt += "<div style='clear:both'>";
        for (j = 0; j < elevatorPerLvl; j++)
        {
            txt += "<svg id='lvl" + i + "no" + j + "' style='float:left' width=" + elevatorWidth + " height=" + elevatorHeight + ">";
            txt += "<polygon points='0,0 " + elevatorWidth + ",0 " + elevatorWidth + "," + elevatorHeight + " 0," + elevatorHeight + "' style='fill:lime;stroke:purple;stroke-width:1' />";
            txt += "</svg>";
        }
        txt += "<svg id='lvl" + i + "' style='float:left' width=" + elevatorWidth + " height=" + elevatorHeight + ">";
        txt += "<polygon points='" + 0 + "," + elevatorHeight * .5 + " " + elevatorWidth * .5 + "," + elevatorHeight * .25 + " " + elevatorWidth + "," + elevatorHeight * .5 + "' style='fill:blue;stroke:purple;stroke-width:1' onclick='request(" + i + ",1)'/>";
        txt += "<polygon points='" + 0 + "," + elevatorHeight * .5 + " " + elevatorWidth * .5 + "," + elevatorHeight * .75 + " " + elevatorWidth + "," + elevatorHeight * .5 + "' style='fill:red;stroke:purple;stroke-width:1' onclick='request(" + i + ",-1)'/>";
        txt += "</svg>";
        txt += "</div>";
    }
    $("body").html(txt);
});

function moveElevator(no,dir)
{
    lvl=elevators[no].lvl;
    index=hasLvl(elevators[no].lvl,elevators[no].stopList);
    if (index!==false) {
        if(elevators[no].stopList[index].type==='requested')
            elevators[no].personsNo++;
        else
            elevators[no].personsNo--; 
        elevators[no].stopList.splice(index, 1);
    }
    elevator = "<polygon points='0,0 " + elevatorWidth + ",0 " + elevatorWidth + "," + elevatorHeight + " 0," + elevatorHeight + "' style='fill:yellow;stroke:purple;stroke-width:1' />";
    elevator+='<text x="'+elevatorWidth/2+'" y="20" fill="black">'+elevators[no].personsNo+'</text>';
    $("#lvl" + lvl + "no" + no).html(elevator);
    elvid = "#lvl" + (lvl - dir) + "no" + no;
    elevator = "<polygon points='0,0 " + elevatorWidth + ",0 " + elevatorWidth + "," + elevatorHeight + " 0," + elevatorHeight + "' style='fill:lime;stroke:purple;stroke-width:1' />";
    $(elvid).html(elevator);
    elevators[no].lvl = lvl;
    elevators[no].dir = dir;
    if (elevators[no].stopList.length==0) {
        elevators[no].dir = 0;
    }
    else
    {
        setTimeout(function() {
            elevators[no].lvl +=dir;
            moveElevator(no,dir);
        }, 1000);
    }
}

function request(lvl, dir)
{
    min = lvlNo + 1;
    selectedElv = -1;
    for (i = 0; i < elevatorPerLvl; i++)
    {
        if (Math.abs(lvl - elevators[i].lvl) < min)
        {
            if (elevators[i].dir * -dir >= 0)
            {
                if (elevators[i].personsNo < elevatorCapacity+1)
                {
                    selectedElv = i;
                    min = Math.abs(-lvl + elevators[i].lvl);
                }
            }
        }
    }
    elevators[selectedElv].stopList.push({lvl:lvl,type:'requested'});
    if(elevators[selectedElv].dir===0)
        moveElevator(selectedElv,-dir);

}

function hasLvl(lvl,list)
{
    for(i=0;i<list.length;i++)
    {
        if(lvl===list[i].lvl)
            return i;
    }
    return false;
}