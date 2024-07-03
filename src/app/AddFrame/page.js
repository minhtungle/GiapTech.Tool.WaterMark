'use client'
'use client'
import { useState, useRef } from 'react';
import { Button, ButtonToolbar, ToggleButton, ToggleButtonGroup, ButtonGroup, Modal } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import styles from "@/app/page.module.css";
import { Container, Row, Col } from "react-bootstrap";
// import Select from 'react-select'
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });


export default function Home() {
  const [modal, setModal] = useState(false);
  const [imgs, setImgs] = useState([{
    src: "/anhmau.jpg",
    name: "anhmau.jpg",
    checked: true
  }]);
  const changeImg = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        newValue = colourOptions.filter((v) => v.isFixed);
        break;
    }

    // setValue(orderOptions(newValue));
    let demoImg = document.getElementsByClassName("demo-img")[0];
    demoImg.src = newValue.value;
  };
  const uploadImgs = () => {
    let inputUpload = document.getElementById("input-upload-img");
    inputUpload.addEventListener("change", function (e) {
      let files = e.target.files,
        imgs = [];
      // if (files.length > 0) setImgs([]);
      for (const file of files) {
        const imgBlob = new Blob([file], { type: "image/jpeg" });
        imgs.push({
          checked: false,
          src: URL.createObjectURL(imgBlob),
          name: file.name,
        });
        // let image = new Image();
        // let imageProperties = {};
        // image.src = URL.createObjectURL(imgBlob);
        // image.onload = function () {
        //   let _image = this;
        //   imageProperties = {
        //     checked: false,
        //     src: _image.src,
        //     name: file.name,
        //     orginWidth: _image.width,
        //     orginHeight: _image.height,
        //     originAspectRatio: (_image.width / _image.height),
        //   };
        //   setImgs(prev => ([
        //     // ...prev,
        //     imageProperties
        //   ]));
        // };
        // imgs.push(imageProperties);
      };
      // console.log(imgs);
      setImgs(imgs);
    });
    inputUpload?.click();
  };
  const downloadImgs = () => {
    if (imgs.length > 0) {
      // const container = imgDemoRefs.current;
      const container = document.getElementsByClassName("real-container")[0];
      // Tạm thời đặt display thành 'block' (hoặc bất cứ giá trị nào khác phù hợp)
      container.style.display = 'block';
      html2canvas(container).then(canvas => {
        const imgBase64 = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgBase64;
        link.download = imgs[0].name;
        link.click();
      });
      container.style.display = 'none';
    };
  }
  return (
    <main className={styles.main}>
      <input type="file" id="input-upload-img" accept=".png, .jpg, .jpeg" multiple hidden />
      <Container fluid>
        <Row>
          <Col md="6" className="list-imgs-container">
            <button onClick={() => uploadImgs()}>
              Tải lên
            </button>
            {
              (() => {
                let options = imgs.map(img => ({
                  value: img.src, label: img.name
                }));
                return <Select
                  defaultValue={options[0]}
                  options={options}
                  onChange={changeImg}
                  id="select-imgs" />
              })()
            }
            <button onClick={() => downloadImgs()}>
              Tải xuống
            </button>
          </Col>
          <Col md="6" className="demo-container">
            {/* <img src="/logo-full.png" className="logo-img"></img> */}
            <img src="/header.png" className="logo-img"></img>
            <div className="demo-img-container">
              <img src="/wm-full-30.png" className="wm-img"></img>
              {/* <img src="/anhmau.jpg" className="demo-img"></img> */}
              <img src={imgs[0].src} className="demo-img"></img>
            </div>
          </Col>
        </Row>
      </Container>
      {
        imgs.map((img, i) => {
          return <Col key={i.toString()} md="6" className="real-container">
            <img src="/header.png" className="logo-img"></img>
            <div className="real-img-container">
              <img src="/wm-full-30.png" className="wm-img"></img>
              <img src={img.src} className="real-img"></img>
            </div>
          </Col>
        })
      }
    </main >
  );
}
