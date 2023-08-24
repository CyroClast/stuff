local functions = {
    fibonaccicache = {0, 1},
    morsetable = {
        [".-"] = "A",
        ["-..."] = "B",
        ["-.-."] = "C",
        ["-.."] = "D",
        ["."] = "E",
        ["..-."] = "F",
        ["--."] = "G",
        ["...."] = "H",
        [".."] = "I",
        [".---"] = "J",
        ["-.-"] = "K",
        [".-.."] = "L",
        ["--"] = "M",
        ["-."] = "N",
        ["---"] = "O",
        [".--."] = "P",
        ["--.-"] = "Q",
        [".-."] = "R",
        ["..."] = "S",
        ["-"] = "T",
        ["..-"] = "U",
        ["...-"] = "V",
        [".--"] = "W",
        ["-..-"] = "X",
        ["-.--"] = "Y",
        ["--.."] = "Z",
        ["-----"] = "0",
        [".----"] = "1",
        ["..---"] = "2",
        ["...--"] = "3",
        ["....-"] = "4",
        ["....."] = "5",
        ["-...."] = "6",
        ["--..."] = "7",
        ["---.."] = "8",
        ["----."] = "9",
        [".-.-.-"] = ".",
        ["--..--"] = ",",
        ["..--.."] = "?",
        [".----."] = "'",
        ["-.-.--"] = "!",
        ["-..-."] = "/",
        ["-.--."] = "(",
        ["-.--.-"] = ")",
        [".-..."] = "&",
        ["---..."] = "=>",
        ["-.-.-."] = ";",
        ["-...-"] = "=",
        [".-.-."] = "+",
        ["-....-"] = "-",
        ["..--.-"] = "_",
        [".-..-."] = "\"",
        ["...-..-"] = "$",
        [".--.-."] = "@",
        ["...---..."] = "SOS",
        [""] = "",
        ["  "] = " "
    },
    DecToHex = {
        [0] = "0",
        [1] = "1",
        [2] = "2",
        [3] = "3",
        [4] = "4",
        [5] = "5",
        [6] = "6",
        [7] = "7",
        [8] = "8",
        [9] = "9",
        [10] = "A",
        [11] = "B",
        [12] = "C",
        [13] = "D",
        [14] = "E",
        [15] = "F"
    }
}

function functions.RGBtoHex(r, g, b)
    local rHex, gHex, bHex = "", "", ""
    if r > 255 then r = 255 elseif r < 0 then r = 0 end
    if g > 255 then g = 255 elseif g < 0 then g = 0 end
    if b > 255 then b = 255 elseif b < 0 then b = 0 end
    local converter = functions.DecToHex
    local r2 = tonumber(r // 16)
    local r1 = r % 16
    
    local g2 = tonumber(g // 16)
    local g1 = g % 16
    
    local b2 = tonumber(b // 16)
    local b1 = b % 16

    rHex = rHex .. converter[r2] .. converter[r1]
    gHex = gHex .. converter[g2] .. converter[g1]
    bHex = bHex .. converter[b2] .. converter[b1]

    local hex = rHex .. gHex .. bHex
    return hex
end

function functions.morseDecode(morsecode)
    local decoded = ""
    local morse = ""
    local swap = false
    for w in string.gmatch(morsecode, ".") do
        if w ~= " " and swap == false then
            morse = morse .. w
        elseif w == " " and swap == false then
            decoded = decoded .. functions.morsetable[morse]
            morse = ""
            swap = true
        elseif w == " " and swap == true then
            morse = morse .. " "
        elseif w ~= " " and swap == true then
            decoded = decoded .. functions.morsetable[morse]
            morse = w
            swap = false
        end
    end

    decoded = decoded .. functions.morsetable[morse]

    return decoded
end

function functions.testingTestTable()
    local item1, item2, item3 = functions.testtable[1], functions.testtable[2], functions.testtable[3]
    return item1, item2, item3
end

function functions.fastFactorialZeroes(number) -- fast check by division; should be the fastest method.
    local zeroes = 0
    repeat
        number = number / 5
        zeroes = zeroes + math.floor(number)
    until number < 1

    return zeroes
end

function functions.slowFactorialZeroes(number) -- inefficient check of how many trailing zeroes a factorial will have.
    local fives = 0
    if number >= 5 then
        for i = number - (number % 5), 5, -5 do
            repeat
                if i % 5 == 0 then fives, i = fives + 1, i / 5 end
            until i % 5 ~= 0
        end
    end

    return fives
end

function functions.fibonacci(item) -- will return the *item*th number of the fibonacci sequence, not the numbers until then.
    local toreturn
    if functions.fibonaccicache[item] == nil then
        local lastn = functions.fibonaccicache[#functions.fibonaccicache - 1] or 1
        local currentn = functions.fibonaccicache[#functions.fibonaccicache] or 1
        local nextn = 0
        while item > 1 do
            nextn = lastn + currentn
            lastn = currentn
            currentn = nextn
            item = item - 1
            functions.fibonaccicache[#functions.fibonaccicache+1] = nextn
        end
        toreturn = nextn
    else
        toreturn = functions.fibonaccicache[item]
    end

    return toreturn
end

function functions.shiftASCIIRight(letter, amount)
    local ascii = string.byte(letter)
    ascii = ascii + amount
    local char = string.char(ascii)

    return char
end

function functions.shiftASCIILeft(letter, amount)
    local ascii = string.byte(letter)
    ascii = ascii - amount
    local char = string.char(ascii)

    return char
end

function functions.funnyNumberProperty(digit, power)
    local sum = 0

    for w in string.gmatch(digit, "%d") do
        sum = sum + tonumber(w) ^ power
        power = power + 1
    end

    local exist = sum / digit
    local fractionary = sum % digit

    if fractionary ~= 0 then
        exist = -1
    else
        exist = sum / digit
    end

    return exist
end

function functions.encodeText(text)
    local encrypted = {}
    local place = 1

    -- first step
    for w in string.gmatch(text, ".") do

        if string.match(w, "%a") ~= nil then
            local ascii = string.byte(w)
            ascii = ascii + 3
            w = string.char(ascii)
            encrypted[place] = w
        else
            encrypted[place] = w
        end

        place = place + 1
    end

    local early = 1
    local late = #encrypted

    -- second step                               the funny thing about this is you could replace it with math.ceil and it would still work.
    for _2 = 1, math.floor(#encrypted / 2), 1 do
        encrypted[early], encrypted[late] = encrypted[late], encrypted[early] 
        early, late = early + 1, late - 1
    end

    -- third step
    for i2 = math.ceil((#encrypted + 1) / 2), #encrypted, 1 do
        local ascii = string.byte(encrypted[i2])
        ascii = ascii - 1
        encrypted[i2] = string.char(ascii)
    end

    return table.concat(encrypted)
end

function functions.badArithmeticFunction(a, b, operation)
    if operation == "add" then
        return a + b
    elseif operation == "subtract" then
        return a - b
    elseif operation == "multiply" then
        return a * b
    elseif operation == "divide" then
        return a / b
    end
end

function functions.isISBN(isbn)
    local sum, pos = 0, 1
    for w in string.gmatch(isbn, "%w") do
        if w == "X" then
            sum, pos = sum + (10 * pos), pos + 1
        else
            sum, pos = sum + (w * pos), pos + 1
        end
    end

    if sum % 11 == 0 then return true else return false end
end

function functions.narcissism(number)
    local narcissism = 0
    for w in string.gmatch(number, "%d") do
        narcissism = narcissism + w ^ #tostring(number)
    end

    if narcissism == number then return true else return false end
end

function functions.quadraticEquation(a, b, c)
    local root1 = (-b + math.sqrt((b ^ 2) - (4 * a * c))) / (2 * a)
    local root2 = (-b - math.sqrt((b ^ 2) - (4 * a * c))) / (2 * a)

    if root1 == root1 and root2 == root2 then
        return root1, root2
    else
        return "impossible t", "o calculate"
    end
end

function functions.getLastTableItem(table) -- i know this sounds useless, but if a table isnt ordered numerically #table doenst work.
    local lastindex = 0
    for i, v in ipairs(table) do
        lastindex = i
    end

    return lastindex
end

function functions.solveAlphabetSymmetry(array)
    local answers = {}

    for i, word in ipairs(array) do
        local strindex = 1
        local matches = 0
        for letter in string.gmatch(word, "%a") do
            if (string.byte(letter) - 64) == strindex or (string.byte(letter) - 96) == strindex then
                matches = matches + 1
            end
            strindex = strindex + 1
        end

        table.insert(answers, matches)
    end

    return answers
end

-- matrix size does not matter, however each row must be the same size as eachother, same applies to collumns.
-- i'll probrably work on one that works for any matrixes later
function functions.matrixSum(matrix1, matrix2)
    -- #matrix[1] is the length of rows
    -- #matrix is the amount of rows
    local largest = {}
    if #matrix1 * #matrix1[1] > #matrix2 * #matrix2[1] then largest = matrix1
    elseif #matrix1 * #matrix1[1] < #matrix2 * #matrix2[1] then largest = matrix2
    else largest = matrix1 end

    for y = 1, #largest do -- adds matrixes
        for x = 1, #largest[1] do
            if matrix1[y][x] == nil then largest[y][x] = matrix2[y][x]
            elseif matrix2[y][x] == nil then largest[y][x] = matrix1[y][x]
            else largest[y][x] = matrix1[y][x] + matrix2[y][x] end
        end
    end

    return largest
end

function functions.formatSeconds(seconds)
    return ("%02d:%02d:%02d"):format(seconds//3600, seconds//60%60, seconds%60)
end

function functions.josephus(people, steps)
    local place = steps
    local permutation = {}
    repeat
        -- i know its a really long line but its just for the cases where #people is 0 or place is out-of-bounds
        if place > #people and #people ~= 0 then repeat place = place - #people until place <= #people elseif #people == 0 then break end
        table.insert(permutation, people[place])
        table.remove(people, place)
        place = place + steps - 1
    until #people == 0

    return permutation
end

function functions.wait(seconds)
    local start = os.time()
    repeat until os.time() > start + seconds
end

function functions.paintfuckInterpreter(code, iterations, width, height)
    -- grid generation
    local grid = {}               -- x1y5 x2y5 x3y5 x4y5 x5y5          N
    for y = 1, height do          -- x1y4 x2y4 x3y4 x4y4 x5y4
        grid[y] = {}              -- x1y3 x2y3 x3y3 x4y3 x5y3     W         E
        for x = 1, width do       -- x1y2 x2y2 x3y2 x4y2 x5y2
            grid[y][x] = 0        -- x1y1 x2y1 x3y1 x4y1 x5y1          S
        end
    end

    -- converts code into a table for reading purposes
    local instructiontable = {}
    for instruction in string.gmatch(code, "[nsew*%[%]]") do
        instructiontable[#instructiontable+1] = instruction
    end

    -- finds every loop in instructiontable and saves it into loops
    local loops = {}
    local count = 0
    for i = 1, #instructiontable do
        if instructiontable[i] == "[" then
            count = count + 1
            loops[count] = {start = i, finish = 0}
        elseif instructiontable[i] == "]" then
            loops[count].finish = i
            count = count - 1
        end
    end

    local x, y = 1, 1
    local clock = 1
    local timesran = 0
    while timesran < iterations and instructiontable[clock] ~= nil and iterations ~= 0 do
        -- pointer movement
        if instructiontable[clock] == "n" then
            y = y - 1
            if y == 0 then y = height end
        elseif instructiontable[clock] == "e" then
            x = x + 1
            if x > width then x = 1 end
        elseif instructiontable[clock] == "w" then
            x = x - 1
            if x == 0 then x = width end
        elseif instructiontable[clock] == "s" then
            y = y + 1
            if y > height then y = 1 end
        end

        -- bit manipulation
        if instructiontable[clock] == "*" then
            grid[y][x] = 1 - grid[y][x]
        end

        -- loop management
        if instructiontable[clock] == "]" then
            if grid[y][x] == 1 then
                clock = loops[count].start
                -- very slightly different than smallfuck, we skip 1 so we dont count the loop (asked for in the "notes" section)
                -- we are allowed to do that because if the pixel was 1, then we would skip back to the matching [, and it wouldn't skip back
                -- because it only skips to the matching ] if the pixel is 0, which cant be the case since for the loop to continue the pixel
                -- has to be 1.
                
            elseif grid[y][x] == 0 then
                count = count - 1
            end
        
        elseif instructiontable[clock] == "[" then
            count = count + 1
            if grid[y][x] == 0 then
                clock = loops[count].finish
                count = count - 1
            end
        end

        clock = clock + 1
        timesran = timesran + 1
    end

    local outtape = ""
    for i = 1, height do
        for j = 1, width do
            outtape = outtape .. grid[i][j]
        end
        if i ~= height then outtape = outtape .. "\r\n" end
    end

    return outtape
end

function functions.smallfuckInterpreter(code, tape) -- code is the code, tape is the pre-defined tape (any length btw)
    local cell = 1
    local tapetable = {}
    for bit in string.gmatch(tape, "%d") do -- turns the tape into a table for mutation purposes
        tapetable[#tapetable+1] = tonumber(bit)
    end

    local instructiontable = {}
    for instruction in string.gmatch(code, "%S") do -- turns the instruction into a table for reading purposes
        instructiontable[#instructiontable+1] = instruction
    end

    local loops = {}
    local count = 0
    for i = 1, #instructiontable do -- finds each loop because i couldnt find a better method
        if instructiontable[i] == "[" then
            count = count + 1
            loops[count] = {start = i, finish = 0}
        elseif instructiontable[i] == "]" then
            loops[count].finish = i
            count = count - 1
        end
    end

    local counter = 1
    while counter <= #instructiontable and cell <= #tapetable and cell >= 1 do
        if instructiontable[counter] == ">" then cell = cell + 1 end
        if instructiontable[counter] == "<" then cell = cell - 1 end
        if instructiontable[counter] == "*" then tapetable[cell] = 1 - tapetable[cell] end
        if instructiontable[counter] == "]" then
            if tapetable[cell] == 1 then
                counter = loops[count].start
            end
            count = count - 1
        end
        if instructiontable[counter] == "[" then
            count = count + 1
            if tapetable[cell] == 0 then
                counter = loops[count].finish
                count = count - 1
            end
        end
        counter = counter + 1
    end

    return table.concat(tapetable)
end

function functions.MMC(numbers)
    local currentprime = 2
    local answer = 1
    local done = false

    repeat
        local wasntdivisible = 0
        for i, v in ipairs(numbers) do
            if numbers[i] % currentprime == 0 then
                numbers[i] = numbers[i] / currentprime
            else
                wasntdivisible = wasntdivisible + 1
            end
        end

        if wasntdivisible == #numbers then
            repeat
                local isprime = true
                currentprime = currentprime + 1
                for i = 2, math.ceil(currentprime / 2) do
                    if currentprime % i == 0 then
                        isprime = false
                    end
                end
            until isprime == true
        else
            answer = answer * currentprime
        end

        local ones = 0
        for i, v in pairs(numbers) do
            ones = ones + numbers[i]
        end

        if ones == #numbers then
            done = true
        end
    until done == true

    return answer
end

function functions.longestRepetition(string)
    local char, len = "", 0
    local repetitions = 0
    local participants = {}
    
    for any in string.gmatch(string, ".") do
        if any ~= char and char ~= "" then -- if the sequence breaks (and its not the first character of the string)
            participants[#participants+1] = {character = char, length = len}
            repetitions = 1
            char, len = any, 1
        elseif any == char then -- if the sequence continues
            repetitions = repetitions + 1
        elseif char == "" then
            repetitions = repetitions + 1
            char, len = any, 1
        end

        if repetitions > len then -- updates the current.. thing idfk what to call it
            len = repetitions
        end
    end

    participants[#participants+1] = {character = char, length = len} -- because it doenst insert the last repetition found.

    local returnindex, longest = 1, 0
    for i = 1, #participants do
        if participants[i].length > longest then
            returnindex, longest = i, participants[i].length
        end
    end

    return {character = participants[returnindex].character, length = participants[returnindex].length}
end

function functions.MDC(numbers)
    for i = 2, #numbers do -- do gcd for each pair
        repeat
            if numbers[i - 1] > numbers[i] then
                numbers[i - 1] = numbers[i - 1] % numbers[i]
            elseif numbers[i - 1] < numbers[i] then
                numbers[i] = numbers[i] % numbers[i - 1]
            end
        until numbers[i - 1] == 0 or numbers[i] == 0 or numbers[i - 1] == numbers[i]
        if numbers[i] == 0 then
            numbers[i] = numbers[i - 1]
        end
    end
    return numbers[#numbers]
end

function functions.divisors(number)
    local divisors = {}
    for i = 1, math.floor(math.sqrt(number)) do
        local divided = number / i
        if divided % 1 == 0 then
            table.insert(divisors, divided)
            local extra = number / divided
            if extra ~= divided then -- if a number is a square root, the algorithm would insert the square root twice; this prevents that.
                table.insert(divisors, number / divided)
            end
        end
    end

    return divisors
end

function functions.squaredDivisors(low, high)
    local clock = os.clock()
    local answers = {}
    for test = low, high do

        local divisors = {}
        for number = 1, math.floor(math.sqrt(test)) do -- divisors
            local divided = test / number
            if divided % 1 == 0 then -- if divided is a whole number, then number divides test.
                table.insert(divisors, divided) -- k = n / m is a divisor of n if m | n
                if number ~= divided then
                    table.insert(divisors, number) -- simple check for the case where test is a perfect square so we dont print number twice.
                end
            end
        end

        local sum = 0
        for i, v in ipairs(divisors) do
            sum = sum + v ^ 2
        end

        if math.sqrt(sum) % 1 == 0 then
            answers[#answers+1] = {test, sum}
        end
    end

    return answers, clock
end

return functions