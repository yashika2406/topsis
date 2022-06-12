
let btn = document.getElementById('btn')
const inpFile = document.getElementById('csvfile')
const myForm = document.getElementById('postForm');

const submitBtn = (event) => {
    event.preventDefault();

    let formdata = new FormData();

    formdata.append("file", inpFile.files[0]);
    formdata.append("weight", myForm[1].value);
    formdata.append("impact", myForm[2].value);
    console.log('hi')
    console.log(Array.from(formdata))
    console.log(formdata)
    // console.log(inpFile.files[0])

    fetch('http://127.0.0.1:8080/', {
        method: "post",
        body: formdata
    }).then(res => res.body)
        .then(rb => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                console.log('done', done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            console.log(done, value);
                            push();
                        })
                    }

                    push();
                }
            });
        })
        .then(stream => {
            // Respond with our stream
            return new Response(stream, { headers: { "Content-Type": "text/csv" } }).text();
        })
        .then(result => {
            // Do things with result
            formdata = null;
            result = JSON.parse(result)
            console.log(result, typeof (result));

            let table = document.createElement('table');
            //iterate over every array(row) within tableArr
            let itr = 0;
            for (let row of result) {
                //Insert a new row element into the table element
                table.insertRow();
                //Iterate over every index(cell) in each array(row)
                for (let cell of row) {
                    //While iterating over the index(cell)
                    //insert a cell into the table element
                    // let newCell = table.rows[table.rows.length - 1].insertCell();
                    if (itr === 1) {
                        table.insertRow();
                        for (let k = 0; k < cell.length; k++) {
                            let newCell = table.rows[table.rows.length - 1].insertCell();
                            newCell.innerHTML = cell[k];

                        }
                    }
                    else {
                        let newCell = table.rows[table.rows.length - 1].insertCell();
                        newCell.innerHTML = cell;
                    }
                    //add text to the created cell element
                    // console.log(newCell)
                }
                itr += 1;
            }
            //append the compiled table to the DOM
            console.log(table);
            let tb = document.getElementById("table");
            console.log(tb);
            // if (tb != undefined) {
            //     tb.removeChild();
            tb.innerHTML = '';
            tb.appendChild(table);
            // }
            // else {
            // tb.appendChild(table);
            // }
            table = null;
            // result.forEach(i=>{
            //     document.getElementsByClassName("table").innerHTML += 
            //     ``
            // })
        })
        .catch(e => console.log(e))
}
// console.log(btn);
// console.log(btn)
// const submitBtn = (event) => {
//     console.log('hwllo')
//     event.preventDefault();
//     var files = document.getElementById('postForm').files;// $('#file').files[0];// e.target.files; 
//     if (files !== null) {
//         if (window.FormData !== undefined) {
//             var formdata = new FormData();
//             for (var x = 0; x < files; x++) {
//                 //formdata.append("file" + x, files[x]);
//                 formdata.append("file" + 0, files[0]);
//             }
//             console.log(formdata)
//         }
//     }
// console.dir(myForm);
// const formData = new FormData(document.getElementById('postForm'));
// console.log(inpFile.files);
// const weight = document.querySelectorAll('#weights')
// const impact = document.querySelectorAll('#impacts')
// formData.append('file', inpFile.files[0])
// formData.append('weight', myForm[1].value)
// console.log(formData)
// const data = new FormData(event.target);
// console.log(data)
// const value = Object.fromEntries(data.entries());
// console.log(value);
// formData.append('impact', myForm[2].value)
// console.log(formData)
// let res = fetch('http://127.0.0.1:8080/', {
//     method: 'POST',
//     body: formData
// });
// let result = res.json()
// alert(result.message)
//     // fetch(`http://127.0.0.1:8080/?file=${inpFile}&weight=${weight[0].value}&impact=${impact[0].value}`)
//     // //     //     // fetch(`http://127.0.0.1:8080/?file=ip.csv&weight=1,3&impact=-,+&`)
//     //     .then(res => {
//     //         console.log("Response", res)
//     //     })
//     //     .catch(e => {
//     //         console.log("error", e)
//     //     })
// }
btn.addEventListener("click", submitBtn)

// function handleSubmit(event) {
//     console.log("CLICKED!!");
//     alert("Submitted");
//     event.preventDefault();
//     const data = new FormData(event.target);
//     console.log(data)
//     const value = Object.fromEntries(data.entries());
//     console.log(value);
//     const myJSON = JSON.stringify(value);
//     console.log(myJSON);
//     console.log(value);
//     let form = document.getElementById("postForm");
//     console.log(form);
//     form.reset(); // Reset all form data
// }

// const form = document.getElementById("postForm");
// form.addEventListener("submit", handleSubmit);



// // const file = document.querySelectorAll('#csvfile')
    // const weight = document.querySelectorAll('#weights')
    // const impact = document.querySelectorAll('#impacts')
    // // console.log(file[0].value);
    // console.log(weight[0].value);
    // console.log(impact[0].value);
    // // let formData = new FormData(document.getElementById('postForm'))
    // // console.log(formData)
    // // console.log("JO")