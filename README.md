# Wordle
Copy of wordle game

/* TASKLIST
1. store word of the day as solution word in a variable --> 
2. Enable divs to take user input:
    a) users should only be allowed to enter 5 letters at once
    b) users should be able to delete 1 or several of entered letters (up to 5) --> current row
    c) block additional user input once 5 letters entered
        i) if users would like to change characters they should use delete function (see b))
    d) users need to press enter to confirm their input
        i) only then input will get checked
            I)    green:  user input char === solution word char
            II)   yellow: user input char is contained in solution word but wrong spot
            III)  grey:   user input char != contained in solution word
    e)  if users don't match solution word in all five spots, 
        needs to be advance to next row (see .html classes row-one to row-six)
    f) if users matches all five letters --> they win
        i)  see d)i)I) --> all letters green
        ii) fun animations to be added 
    g) if neither of the six rows matches solution words --> users loose 

*/

