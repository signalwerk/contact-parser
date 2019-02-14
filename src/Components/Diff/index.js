import React from "react";
import "./styles.css";
import {
  diffChars,
  diffArrays,
  diffWords,
  diffWordsWithSpace,
  diffLines,
  diffTrimmedLines,
  diffSentences,
  diffCss,
  diffJson
} from "diff";

/**
 * Display diff in a stylable form.
 *
 * Default is character diff. Change with props.type. Valid values
 * are 'chars', 'words', 'sentences', 'json'.
 *
 *  - Wrapping div has class 'Difference', override with props.className
 *  - added parts are in <ins>
 *  - removed parts are in <del>
 *  - unchanged parts are in <span>
 *
 * Origi
 */

const newlineRegex = /(\r\n|\n\r|\r|\n)/g;

const fnMap = {
  chars: diffChars,
  words: diffWords,
  wordsWithSpace: diffWordsWithSpace,
  lines: diffLines,
  trimmedLines: diffTrimmedLines,
  sentences: diffSentences,
  css: diffCss,
  json: diffJson,
  array: diffArrays
};

export default class ReactDiff extends React.Component {
  // static propTypes = {
  //   inputA: React.PropTypes.oneOfType([
  //     React.PropTypes.string,
  //     React.PropTypes.object,
  //   ]),
  //   inputB: React.PropTypes.oneOfType([
  //     React.PropTypes.string,
  //     React.PropTypes.object,
  //   ]),
  //   type: React.PropTypes.oneOf([
  //     'chars',
  //     'words',
  //     'wordsWithSpace',
  //     'lines',
  //     'trimmedLines',
  //     'sentences',
  //     'css',
  //     'json',
  //   ]),
  //   options: React.PropTypes.object,
  //   className: React.PropTypes.string,
  // };

  constructor() {
    super();
    this.displayName = "Diff";

    this.defaultProps = {
      inputA: "",
      inputB: "",
      type: "chars",
      options: null,
      className: "difference"
    };
  }

  escape = str => {
    return str.split(newlineRegex).map(function(line, index) {
      if (line.match(newlineRegex)) {
        return [
          React.createElement("span", { className: "Diff-br" }, "¶"),
          React.createElement("br", { key: index })
        ];
      } else {
        return line;
      }
    });
  };

  render() {
    const diff = fnMap[this.props.type || "lines"](
      this.props.inputA,
      this.props.inputB,
      this.props.options
    );

    const result = diff.map((part, index) => {
      if (part.added) {
        return (
          <ins className="Diff-Ins" key={index}>
            {this.escape(part.value)}
          </ins>
        );
      }
      if (part.removed) {
        return (
          <del className="Diff-Del" key={index}>
            {this.escape(part.value)}
          </del>
        );
      }
      return (
        <span className="Diff-None" key={index}>
          {this.escape(part.value)}
        </span>
      );
    });

    return <div className={this.props.className}>{result}</div>;
  }
}
