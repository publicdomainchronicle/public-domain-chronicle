/*
Copyright 2017 The BioBricks Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

document.addEventListener('DOMContentLoaded', function () {
  addAnotherInputButton('publications', 'Publication', 25)
  addAnotherInputButton('attachments', 'Attachment', 5)
  addSubmitSafety()
  addWordCount('finding')
  addWordCount('safety')
  configurePatentSearch()
})

// Add a button at the end of a <section> to add another
// <li><input></li> to the <section>'s <ul>.
function addAnotherInputButton (sectionID, buttonText, max) {
  var section = document.getElementById(sectionID)
  var button = document.createElement('button')
  button.appendChild(
    document.createTextNode('Add Another ' + buttonText)
  )
  button.addEventListener('click', function (event) {
    var ul = section.getElementsByTagName('ul')[0]
    var items = ul.getElementsByTagName('li')
    var firstItem = items[0]
    // Clone the first <li><input></li> in the <ul>.
    var clone = firstItem.cloneNode(true)
    // Clear the cloned <input>'s value.
    clone.getElementsByTagName('input')[0].value = ''
    // Append the cloned <li> to the <ul>.
    ul.appendChild(clone)
    if (items.length > max - 1) {
      section.removeChild(button)
    }
    event.preventDefault()
    event.stopPropagation()
  })
  section.appendChild(button)
}

var SAFETY_TIMEOUT = 10000

// Disable the form submit button, and add a "safety switch" button
// beside it that enables submission for 10 seconds.  This should help
// prevent folks from accidentally clicking submit, at least when
// JavaScript is enabled in their browsers.
function addSubmitSafety () {
  var section = document.getElementById('submit')
  var submit = section.getElementsByTagName('input')[0]
  var safety = document.createElement('button')
  safety.className = 'safety'
  safety.appendChild(
    document.createTextNode('Enable the Publish Button')
  )
  submit.setAttribute('disabled', true)
  safety.addEventListener('click', function (event) {
    section.removeChild(safety)
    submit.removeAttribute('disabled')
    setTimeout(addSubmitSafety, SAFETY_TIMEOUT)
    event.preventDefault()
    event.stopPropagation()
  })
  section.appendChild(safety, submit)
}

// Add a <p> listing word count below the <textarea> in a <section>.
function addWordCount (sectionID) {
  var section = document.getElementById(sectionID)
  var textarea = section.getElementsByTagName('textarea')[0]
  var wordCount = document.createElement('p')
  wordCount.className = 'wordCount'
  section.appendChild(wordCount)
  textarea.addEventListener('keyup', updateCount)
  textarea.addEventListener('paste', updateCount)
  updateCount()
  function updateCount () {
    var count = countWords(textarea)
    wordCount.innerHTML = count === 1 ? '1 word' : count + ' words'
  }
}

function countWords (textarea) {
  return textarea.value.split(/\w+\s*/g).length - 1
}

function configurePatentSearch () {
  var results = document.getElementById('ipcSearchResults')
  var added = document.getElementById('ipcs')
  var input = document.getElementById('ipcSearchBox')
  input.addEventListener('input', function () {
    var search = input.value
    if (search) {
      var request = new window.XMLHttpRequest()
      request.overrideMimeType('application/json')
      request.addEventListener('load', function () {
        var body = this.responseText
        var response
        try {
          response = JSON.parse(body)
        } catch (error) {
          return
        }
        window.requestAnimationFrame(function () {
          results.innerHTML = ''
          response
            .slice(0, 10)
            .forEach(function (result) {
              result.ipcs.forEach(function (ipc) {
                var li = document.createElement('li')
                li.addEventListener('change', addIPC)
                var label = document.createElement('label')
                var input = document.createElement('input')
                input.setAttribute('type', 'checkbox')
                input.setAttribute('value', ipc)
                label.appendChild(input)
                label.appendChild(
                  document.createTextNode(
                    ' ' + ipc + ': ' + result.catchword
                  )
                )
                results.appendChild(li)
                li.appendChild(label)
              })
            })
        })
      })
      request.open(
        'GET', '/ipc?search=' + encodeURIComponent(input.value)
      )
      request.send()
    } else {
      results.innerHTML = ''
    }
  })

  function addIPC (event) {
    var li = this
    window.requestAnimationFrame(function () {
      li.removeEventListener('change', addIPC)
      li.addEventListener('change', removeIPC)
      li.parentNode.removeChild(li)
      added.appendChild(li)
      li.getElementsByTagName('input')[0]
        .setAttribute('name', 'classifications[]')
    })
  }

  function removeIPC (event) {
    this.parentNode.removeChild(this)
  }
}
