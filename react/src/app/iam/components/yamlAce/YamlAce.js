import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import _ from 'lodash';
import './YamlAce.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/fold/foldgutter.css';

export default class YamlAce extends Component {
  static defaultProps = {
    readOnly: false,
    options: {
      theme: 'neat',
      mode: 'yaml',
      lineNumbers: true,
      lineWrapping: true,
    },
  };

  state = {};

  aceEditor = null;

  saveRef = (instance) => this.aceEditor = instance;

  /**
   * 设置本次修改的高亮
   */
  handleModifyHighLight = _.debounce((values) => {
    this.props.onChange(values);
  }, 500);

  handleChange = (values, options) => {
    const editor = this.aceEditor.getCodeMirror();
    const start = options.from;
    const end = options.to;
    const newValue = editor.getLine(start.line);
    const from = { line: start.line, ch: newValue.split(':')[0].length + 2 };
    const ch = 1000;
    const to = { line: end.line, ch: ch };
    const lineInfo = editor.lineInfo(from.line).bgClass;
    // 新增行
    if (options.origin === '+input' && options.text.toString() === ',') {
      editor.addLineClass(start.line + 1, 'background', 'newLine-text');
    } else if (options.origin === '+input' && options.from.ch === 0 && options.to.ch === 0) {
      editor.addLineClass(start.line, 'background', 'newLine-text');
    } else if (lineInfo === 'lastModifyLine-line') {
      editor.addLineClass(start.line, 'background', 'lastModifyLine-line');
      editor.markText(from, to, { className: 'lastModifyLine-text' });
    } else if (lineInfo === 'newLine-text') {
      editor.addLineClass(start.line, 'background', 'newLine-text');
    } else if (options.origin === '+delete' && options.removed.toString() === ',') {
      const s = 'return';
    } else {
      editor.addLineClass(start.line, 'background', 'lastModifyLine-line');
      editor.markText(from, to, { className: 'lastModifyLine-text' });
    }
    this.handleModifyHighLight(values, options);
  };

  scrollTo({ left, top }) {
    const editor = this.aceEditor.getCodeMirror();
    editor.scrollTo(left, top);
  }

  render() {
    const { readOnly, options, ...restProps } = this.props;
    const props = {
      options: {
        ...options,
        readOnly,
      },
      ...restProps,
      onChange: readOnly ? void 0 : this.handleChange,
      ref: this.saveRef,
    };
    return (
      <CodeMirror {...props} />
    );
  }
}
