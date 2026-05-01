addLayer("meta", {
    name: "Meta",
    position: -4,
    row: 0,
    symbol() {return 'Meta'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("ach", {
    name: "Achievements",
    position: -3,
    row: 0,
    symbol() {return "Achievements"},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(255, 208, 0)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
        ["display-text", function() { return "<h3>You have unlocked </h3><b><h2>" + player.ach.achievements.length + "</h2></b><h3> achievements" }], 
        "blank",
        "achievements",
    ],
    achievements: {
    11: {
        name: "It always starts somewhere",
        tooltip: "Buy U11 once.",
        done() { return getBuyableAmount('po', 11).gt(0) }
    },
    }
})

addLayer("mil", {
    name: "goals",
    position: -3,
    row: 0,
    symbol() {return "Milestones"},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(143, 35, 190)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
        ["display-text", function() { return "<h3>You have </h3><b><h2>" + format(new Decimal(0)) + "</h2></b><h3> milestones." }], 
        "blank",
        "milestones",
    ],
    milestones: {
    1: {
        requirementDescription: "PM1 10 total U11's",
        effectDescription: "blah",
        done() { return getBuyableAmount('po', 11).gte(10) }
    }
    },
})

addLayer("Game", {
    name: "Game",
    position: -1,
    row: 0,
    symbol() {return 'Game'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

addLayer("po", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Points", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ececec",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    microtabs:{
        tab:{
            "Points":{
                name(){return 'Production'}, // Name of tab button
                content:[
                    "buyables"
                ],
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){return true},
    buyables: {
    11: {
        title: "Upgrade 11 (U11)",
        cost(x) { return new Decimal(10).mul(Decimal.pow(1.10, x.pow(1.1))) },
        display() { 
            let amount = getBuyableAmount(this.layer, this.id).add(this.free())
            return "Cost: " + format(this.cost()) + " points<br>Effect: +" + format(this.effect(amount)) + " > +" +  format(this.effect(amount.add(1))) + " to point production<br>Amount: " + format(Decimal.add(amount, this.free()))
        },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
            return Decimal.mul(x.add(this.free()), this.base())
        },
        base() {
            let base = new Decimal(1)
            return base
        },
        free() {
            let free = new Decimal(0)
            return free
        },
        tooltip() { return "Effect per Upgrade: +" + format(this.base()) + "  to point production<br>Free buyables: " + format(this.free()) }
    },
    }
})

addLayer("re", {
    name: "research", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Research", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#17c8cf",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "research point", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    microtabs:{
        tab:{
            "Points":{
                name(){return 'Production'}, // Name of tab button
                content:[
                    "buyables"
                ],
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){return false},
})

// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed