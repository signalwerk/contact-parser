import React, { Component } from "react";
import "./App.css";
import Diff from "./Components/Diff";
import TextareaAutosize from "react-textarea-autosize";

// Require `PhoneNumberFormat`.
const PNF = require("google-libphonenumber").PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

const newlineRegex = /(\r\n|\n\r|\r|\n)/g;

const noExcepetion = func => {
  let ret;
  try {
    ret = func();
  } catch (err) {
    ret = "";
  } finally {
    return ret;
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "...Type your numbers here ...",
      corrected: ""
    };
  }

  correctTel = str => {
    return str
      .split("\n")
      .map(function(line, index) {
        if (line.match(/^[0-9+()-/–. ]+$/)) {
          const number = noExcepetion(() => phoneUtil.parse(line, "DE"));

          if (number) {
            return phoneUtil.format(number, PNF.INTERNATIONAL);
          }
        }

        return line;
      })
      .join("\n");
  };

  escape = str => {
    return str.split(newlineRegex).map(function(line, index) {
      if (line.match(newlineRegex)) {
        return [
          // React.createElement("span", { className: "br" }, "¶"),
          React.createElement("br", { key: index })
        ];
      } else {
        return line;
      }
    });
  };

  handleChange(event) {
    let newValue = event.target.value;

    this.setState({
      ...this.state,
      input: newValue,
      corrected: this.correctTel(newValue)
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Telephone Numbers according to{" "}
            <a
              target="_blank"
              className="App-Link"
              href="https://www.itu.int/rec/T-REC-E.123-200102-I/en"
              rel="noreferrer noopener nofollow"
            >
              ITU-T Recommendation E.123
            </a>
          </p>
        </header>

        <div className="App-Diff">
          <div className="App-Line">
            <div className="App-Left">
              <label>
                <TextareaAutosize
                  value={this.state.input}
                  onChange={e => this.handleChange(e)}
                />
              </label>
            </div>
            <div className="App-Mid">
              {this.state.corrected && this.escape(this.state.corrected)}
            </div>
            <div className="App-Right">
              {<Diff inputA={this.state.input} inputB={this.state.corrected} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
