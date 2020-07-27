/* global getPluginParameter, getMetaData, fieldProperties, setAnswer, setMetaData */

var duration = getPluginParameter('duration')
var type = getPluginParameter('type')
var endAfter = getPluginParameter('end-after')
var metadata = getMetaData()
var timeStart // Track time limit on each field in milliseconds

if (duration === null) {
  timeStart = 60000 // Default time limit on each field in milliseconds
} else {
  timeStart = duration * 1000 // Parameterized time limit on each field in milliseconds
}

var choices = fieldProperties.CHOICES // Array of choices
var complete = false // Keep track of whether the test was completed
var timeLeft = timeStart // Starts this way for the display.
var timePassed = 0 // Time passed so far
var timerRunning = false // Track whether the timer is running
var startTime = 0 // This will get an actual value when the timer starts in startStopTimer();
var selectedItems // Track selected (incorrect) items
var lastSelectedIndex // Track index of last selected item
var ans = choices[0].CHOICE_VALUE //
var timeRemaining = 0
var endFirstLine = 'No' // Whether they ended on the firstline or not
var choiceValuesArray = [] // Array of choice labels
var columns = 10 // Number of columns on grid printout (letters)

var timerDisp = document.querySelector('#timer')
var button = document.querySelector('#startstop')
var endEarlyDisplay = document.querySelector('#endearly')
var nextButton = document.getElementById('nextButton')
var backButton = document.getElementById('backButton')
var timerDisplay = document.querySelector('#timerDisplay')
var modal = document.getElementById('modal') // Get the modal
var modalContent = document.getElementById('modalContent') // Get the modal content
var firstModalButton = document.getElementById('firstModalButton') // Get the first button
var secondModalButton = document.getElementById('secondModalButton') // Get the second button

var div = document.getElementById('button-holder')
var secondDIV
var x = window.matchMedia('(max-width: 660px)')
var y = window.matchMedia('(min-width: 660px)')
var screenSize

var topTen
var firstTenItems = []
var itemCounter = 0
var items = []

checkSmall(x)
checkMedium(y)
x.addListener(checkSmall)
y.addListener(checkMedium)

if (type === 'words') {
  columns = 5 // Number of columns on grid printout (words)
  if (screenSize !== 'small') {
    screenSize = 'large'
  }
}

if (type === 'reading') {
  columns = choices.length // Number of columns on grid printout (words)
  if (screenSize !== 'small') {
    screenSize = 'large'
  }
}

// Set end after default to 10 for letters
if (endAfter == null && columns === 10) {
  endAfter = 10
} else if (endAfter == null && columns === 5) {
  endAfter = 5
} else {
  endAfter = parseInt(endAfter)
}
createGrid(choices)

if (metadata !== null) {
  endEarlyDisplay.classList.remove('hidden')
  endEarlyDisplay.innerText = 'Test Complete'
  button.innerHTML = 'Restart'
  button.onclick = function () {
    timerDisplay.classList.remove('hidden')
    endEarlyDisplay.classList.add('hidden')
    openDataWarningModal()
  }
}

if (createGrid) {
  var gridItems = document.querySelectorAll('.box')
  Array.from(gridItems, function (box) {
    box.addEventListener('click', function () {
      var it = this.classList.item(1)
      var itemIndex = it.slice(4)
      console.log('Item index is ' + itemIndex)
      itemClicked(this, itemIndex)
    })
  })
  setInterval(timer, 1)
}

choices.slice(0, endAfter)

for (x = 0; x < topTen.length; x++) {
  firstTenItems.push(choices[x].CHOICE_VALUE)
}

// get next button and bind click event handler
document.querySelector('.next').addEventListener('click', function () {
  backButton.classList.remove('hideButton')
  var fieldset1 = document.querySelector('#fieldset1')
  var fieldset2 = document.querySelector('#fieldset2')
  var fieldset3 = document.querySelector('#fieldset3')
  var fieldset4 = document.querySelector('#fieldset4')
  var fieldset5 = document.querySelector('#fieldset5')
  var fieldset6 = document.querySelector('#fieldset6')
  var fieldset7 = document.querySelector('#fieldset7')
  var fieldset8 = document.querySelector('#fieldset8')
  var fieldset9 = document.querySelector('#fieldset9')
  var fieldset10 = document.querySelector('#fieldset10')

  if (type === 'letters') {
    if (!fieldset1.classList.contains('hidden')) {
      fieldset1.classList.add('hidden')
      fieldset2.classList.remove('hidden')
      fieldset3.classList.remove('hidden')
    } else if (!fieldset2.classList.contains('hidden')) {
      fieldset2.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset4.classList.remove('hidden')
    } else if (!fieldset3.classList.contains('hidden')) {
      fieldset3.classList.add('hidden')
      fieldset4.classList.remove('hidden')
      fieldset5.classList.remove('hidden')
    } else if (!fieldset4.classList.contains('hidden')) {
      fieldset4.classList.add('hidden')
      fieldset5.classList.remove('hidden')
      fieldset6.classList.remove('hidden')
    } else if (!fieldset5.classList.contains('hidden')) {
      fieldset5.classList.add('hidden')
      fieldset6.classList.remove('hidden')
      fieldset7.classList.remove('hidden')
    } else if (!fieldset6.classList.contains('hidden')) {
      fieldset6.classList.add('hidden')
      fieldset7.classList.remove('hidden')
      fieldset8.classList.remove('hidden')
    } else if (!fieldset7.classList.contains('hidden')) {
      fieldset7.classList.add('hidden')
      fieldset8.classList.remove('hidden')
      fieldset9.classList.remove('hidden')
    } else if (!fieldset8.classList.contains('hidden')) {
      fieldset8.classList.add('hidden')
      fieldset9.classList.remove('hidden')
      fieldset10.classList.remove('hidden')
      nextButton.classList.add('hideButton')
    }
  }

  if (type === 'words' && screenSize === 'small') {
    if (!fieldset1.classList.contains('hidden')) {
      fieldset1.classList.add('hidden')
      fieldset2.classList.add('hidden')
      fieldset3.classList.add('hidden')
      fieldset5.classList.remove('hidden')
      fieldset6.classList.remove('hidden')
      fieldset7.classList.remove('hidden')
    } else if (!fieldset4.classList.contains('hidden')) {
      fieldset4.classList.add('hidden')
      fieldset5.classList.add('hidden')
      fieldset6.classList.add('hidden')
      fieldset8.classList.remove('hidden')
      fieldset9.classList.remove('hidden')
      fieldset10.classList.remove('hidden')
      nextButton.classList.add('hideButton')
    }
  }
})

// get back button and bind click event handler
document.querySelector('.back').addEventListener('click', function () {
  nextButton.classList.remove('hideButton')
  var fieldset1 = document.querySelector('#fieldset1')
  var fieldset2 = document.querySelector('#fieldset2')
  var fieldset3 = document.querySelector('#fieldset3')
  var fieldset4 = document.querySelector('#fieldset4')
  var fieldset5 = document.querySelector('#fieldset5')
  var fieldset6 = document.querySelector('#fieldset6')
  var fieldset7 = document.querySelector('#fieldset7')
  var fieldset8 = document.querySelector('#fieldset8')
  var fieldset9 = document.querySelector('#fieldset9')
  var fieldset10 = document.querySelector('#fieldset10')

  if (type === 'letters') {
    if (!fieldset10.classList.contains('hidden')) {
      fieldset10.classList.add('hidden')
      fieldset9.classList.remove('hidden')
      fieldset8.classList.remove('hidden')
    } else if (!fieldset9.classList.contains('hidden')) {
      fieldset9.classList.add('hidden')
      fieldset8.classList.remove('hidden')
      fieldset7.classList.remove('hidden')
    } else if (!fieldset8.classList.contains('hidden')) {
      fieldset8.classList.add('hidden')
      fieldset7.classList.remove('hidden')
      fieldset6.classList.remove('hidden')
    } else if (!fieldset7.classList.contains('hidden')) {
      fieldset7.classList.add('hidden')
      fieldset6.classList.remove('hidden')
      fieldset5.classList.remove('hidden')
    } else if (!fieldset6.classList.contains('hidden')) {
      fieldset6.classList.add('hidden')
      fieldset5.classList.remove('hidden')
      fieldset4.classList.remove('hidden')
    } else if (!fieldset5.classList.contains('hidden')) {
      fieldset5.classList.add('hidden')
      fieldset4.classList.remove('hidden')
      fieldset3.classList.remove('hidden')
    } else if (!fieldset4.classList.contains('hidden')) {
      fieldset4.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset2.classList.remove('hidden')
    } else if (!fieldset3.classList.contains('hidden')) {
      fieldset3.classList.add('hidden')
      fieldset2.classList.remove('hidden')
      fieldset1.classList.remove('hidden')
      backButton.classList.add('hideButton')
    }
  }

  if (type === 'words' && screenSize === 'small') {
    if (!fieldset10.classList.contains('hidden')) {
      fieldset10.classList.add('hidden')
      fieldset9.classList.add('hidden')
      fieldset8.classList.add('hidden')
      fieldset6.classList.remove('hidden')
      fieldset5.classList.remove('hidden')
      fieldset4.classList.remove('hidden')
    } else if (!fieldset7.classList.contains('hidden')) {
      fieldset7.classList.add('hidden')
      fieldset6.classList.add('hidden')
      fieldset5.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset2.classList.remove('hidden')
      fieldset1.classList.remove('hidden')
      backButton.classList.add('hideButton')
    }
  }
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none'
  }
}

function checkSmall (x) { if (x.matches) { screenSize = 'small' } }
function checkMedium (y) { if (y.matches) { screenSize = 'medium' } }

function createGrid (keys) {
  var counter = 0
  var fieldsetClass
  for (var i = 0; i < keys.length / columns; i++) {
    var fieldset = document.createElement('section')
    var tracker = i + 1
    if (type !== 'reading') {
      var legend = document.createElement('h1')
      var text1 = '(' + tracker + ')'
      var legendText = document.createTextNode(text1)
      legend.appendChild(legendText)
      fieldset.appendChild(legend)
      var fieldsetId = 'fieldset' + tracker
      if (screenSize === 'small' && type === 'letters') {
        fieldsetClass = 'sm' + tracker
        if (tracker > 2) {
          fieldset.classList.add('hidden')
        }
      } else if (screenSize === 'small' && type === 'words') {
        fieldsetClass = 'lg' + tracker
        if (tracker > 4) {
          fieldset.classList.add('hidden')
        }
      } else if (screenSize === 'medium') {
        fieldsetClass = 'ms' + tracker
        nextButton.classList.add('hideButton')
      } else if (screenSize === 'large') {
        fieldsetClass = 'lg' + tracker
        nextButton.classList.add('hideButton')
      }
      fieldset.setAttribute('id', fieldsetId)
      fieldset.classList.add(fieldsetClass, 'fieldset')
    } else {
      fieldset.classList.add('pg')
    }
    for (var j = 0; j < columns; j++) {
      secondDIV = document.createElement('div')
      var itemValue = counter + 1
      var itemClass = 'item' + itemValue
      secondDIV.classList.add('box', itemClass)
      if (type === 'reading') {
        secondDIV.classList.add('pgBox')
      }
      var text = document.createTextNode(choices[counter].CHOICE_LABEL)
      choiceValuesArray.push(choices[counter].CHOICE_VALUE) // add choice labels to Array
      counter++
      secondDIV.appendChild(text)
      fieldset.appendChild(secondDIV)
    }
    div.append(fieldset)
  }
  return true
}

function timer () {
  if (timerRunning) {
    timePassed = Date.now() - startTime
    timeLeft = timeStart - timePassed
  }

  if (timeLeft < 0) {
    endTimer()
  }
  timerDisp.innerHTML = Math.ceil(timeLeft / 1000)
}

function startStopTimer () {
  timerDisplay.classList.remove('hidden')
  if (timerRunning) {
    timerRunning = false
    button.innerHTML = 'Resume'
    openPauseModal()
  } else {
    startTime = Date.now() - timePassed
    timerRunning = true
    button.innerHTML = 'Pause'
  }
}

function endEarly () {
  timeRemaining = Math.ceil(timeLeft / 1000) // Amount of time remaining
  endTimer()
}

function endTimer () {
  console.log('entering end timer')
  timeLeft = 0
  timerRunning = false
  openLastItemModal()
  selectedItems = getSelectedItems()
}

function itemClicked (item, itemIndex) {
  if (timerRunning) { // This way, it only works when the timer is running
    var classes = item.classList
    if (classes.contains('selected')) {
      classes.remove('selected')
    } else {
      classes.add('selected')
      if (itemCounter <= 9) {
        itemCounter++
        items.push(itemIndex)
        var isSame = (firstTenItems.sort().toString() === items.sort().toString())
        if (isSame) {
          console.log('Is same is ' + isSame)
          timerRunning = false
          endFirstLine = 'Yes' // Indicate that the first line was all incorrect
          openIncorrectItemsModal()
        }
        console.log(itemCounter)
        console.log(items)
      }
    }
  } else if (timeLeft === 0) { // This is for selecting the last letter, and it will be used at the very end.
    for (var cell of gridItems) { // This removes the red border in case another cell was previously selected
      cell.classList.remove('lastSelected')
    }
    item.classList.add('lastSelected')
    lastSelectedIndex = itemIndex // Get index of last selected item
    checkLastItem()
    if (complete) {
      console.log('ending last selected')
      setResult()
      openThankYouModal()
      console.log('exiting last selected')
    } else {
      for (var cell of gridItems) { // This removes the red border in case another cell was previously selected
        cell.classList.remove('lastSelected')
      }
      item.classList.add('lastSelected')
      lastSelectedIndex = itemIndex // Get index of last selected item
      checkLastItem()
    }
  }
}

function checkLastItem () {
  var selectedItemsArray = selectedItems.split(' ')
  var lastClickedItem = selectedItemsArray[selectedItemsArray.length - 1] // Get the last item that was incorrect
  var indexLastClickedItem = choiceValuesArray.lastIndexOf(lastClickedItem) // Get index of last clicked item
  var indexLastSelectedItem = choiceValuesArray.lastIndexOf(lastSelectedIndex) // Get index of last selected item
  if (indexLastClickedItem > (indexLastSelectedItem)) {
    openModal('Either pick the last incorrect item, or one after that.')
    Array.from(gridItems, function (box) {
      box.addEventListener('click', function () {
        var a = this.classList.item(1)
        var b = a.slice(4)
        itemClicked(this, b)
      })
    })
  } else {
    complete = true
  }
}

function getSelectedItems () {
  var selectedLet = []
  for (var cell of gridItems) {
    if (cell.classList.contains('selected')) {
      var m = cell.classList.item(1)
      var n = m.slice(4)
      selectedLet.push(n)
    }
  }
  return selectedLet.join(' ')
}

function clearAnswer () {
  setAnswer()
  timePassed = 0
}

// set the results to published
function setResult () {
  var totalItems = choices.map(function (o) { return o.CHOICE_VALUE }).indexOf(lastSelectedIndex) + 1 // total number of items attempted
  var splitselectedItems = selectedItems.split(' ')
  var incorrectItems = splitselectedItems.length // Number of incorrect items attempted
  var correctItems = totalItems - incorrectItems // Number of correct items attempted
  var result = timeRemaining + '|' + totalItems + '|' + incorrectItems + '|' + correctItems + '|' + endFirstLine
  setAnswer(ans) // set answer to dummy result
  setMetaData(result) // make result accessible as plugin metadata
}

// Open Modal
function openModal (content) {
  modalContent.innerText = content
  firstModalButton.innerText = 'Yes'
  secondModalButton.innerText = 'No'
  modal.style.display = 'block'
}

function openThankYouModal () {
  modalContent.innerText = 'Thank you! You can continue.'
  firstModalButton.innerText = 'Done'
  secondModalButton.classList.add('hidden')
  firstModalButton.style.width = '100%'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    button.innerText = 'Restart'
    secondModalButton.classList.remove('hidden')
    firstModalButton.style.width = '50%'
    button.onclick = function () {
      // timerRunning = true
      openDataWarningModal()
    }
  }
}

function openLastItemModal () {
  modalContent.innerText = 'Please tap the last item attempted'
  firstModalButton.innerText = 'Okay'
  secondModalButton.classList.add('hidden')
  firstModalButton.style.width = '100%'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

function openPauseModal () {
  modalContent.innerText = 'Paused'
  firstModalButton.innerText = 'Restart'
  secondModalButton.innerText = 'End'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    openDataWarningModal()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
    button.innerText = 'Restart'
    openConfirmEndModal()
  }
}

function openDataWarningModal () {
  modalContent.innerText = 'Are you sure you want to restart? All answers up to this point will be lost.'
  firstModalButton.innerText = 'Yes'
  secondModalButton.innerText = 'Cancel'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    restart()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

function openConfirmEndModal () {
  modalContent.innerText = 'Are you sure you would like to end early? The current time and selections will be saved.'
  firstModalButton.innerText = 'Yes'
  secondModalButton.innerText = 'Cancel'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    endEarly()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

function openIncorrectItemsModal () {
  modalContent.innerText = 'End now? ' + endAfter + ' wrong answers on row 1.'
  firstModalButton.innerText = 'Yes'
  secondModalButton.innerText = 'No'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    endEarly()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

function restart () {
  for (var cell of gridItems) { // This removes the red border in case another cell was previously selected
    cell.classList.remove('selected')
    cell.classList.remove('lastSelected')
  }
  timerRunning = false
  timerDisplay.classList.add('hidden')
  clearAnswer()
  button.innerText = 'Start'
  button.onclick = function () {
    timerDisplay.classList.remove('hidden')
    startStopTimer()
  }
}
