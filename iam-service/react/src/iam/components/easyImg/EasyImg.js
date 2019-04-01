import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

import './EasyImg.scss';


export default class EasyImg extends Component {
  state={
    isOpen: false,
  };

  onOpenLightboxChange = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };
  render() {
    const { src } = this.props;
    return (
      <div onClick={this.onOpenLightboxChange} className="c7n-iam-easy-img">
        <img src={src} alt="" style={{ display: 'block', width: '100%' }} />
        {
          this.state.isOpen ?
            <Lightbox
              mainSrc={src}
              onCloseRequest={this.onOpenLightboxChange}
            /> : null
        }
      </div>
    );
  }
}
