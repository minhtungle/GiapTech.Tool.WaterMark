'use client'
'use client'
import { useState } from 'react';
import { Button, ButtonToolbar, ToggleButton, ToggleButtonGroup, ButtonGroup, Modal } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from "../page.module.css";
import { Container, Row, Col } from "react-bootstrap";
// import Select from 'react-select'
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });


export default function Home() {
  const [imgs, setImgs] = useState([{
    src: "./anhmau.jpg",
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
  const changeImg_ = () => {
    let selectImgs = document.getElementById("select-imgs");
    let demoImg = document.getElementsByClassName("demo-img")[0];
    demoImg.src = selectImgs.value;
  }
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
      };
      setImgs(imgs);
    });
    inputUpload?.click();
  };
  const downloadImgs = () => {
    if (imgs.length > 0) {
      if (imgs.length == 1) {
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
      } else {
        const zip = new JSZip();
        // Mảng chứa các promise từ html2canvas
        const promises = [];
        // Duyệt qua mảng imgs và tạo canvas từng ảnh
        imgs.forEach((img, index) => {
          const container = document.getElementsByClassName("real-container")[index];
          container.style.display = 'block'; // Hiển thị phần tử để tạo canvas

          // Tạo promise từ html2canvas
          const promise = html2canvas(container).then(canvas => {
            const imgBase64 = canvas.toDataURL("image/png").split(",")[1];
            zip.file(img.name, imgBase64, { base64: true });

            container.style.display = 'none'; // Ẩn phần tử sau khi đã tạo canvas

            return imgBase64; // Trả về imgBase64 cho promise chain
          });

          promises.push(promise);
        });

        // Đợi cho tất cả các promises hoàn thành trước khi tạo và tải file zip
        Promise.all(promises).then(() => {
          zip.generateAsync({ type: "blob" })
            .then(function (content) {
              // Sử dụng thư viện FileSaver.js hoặc một phương thức tương tự để lưu file zip
              saveAs(content, "images.zip");
            });
        });
      };
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
            {/* <select id="select-imgs" onChange={changeImg}>
              {
                imgs.map((img, index) => {
                  return <option key={index.toString()} value={img.src}>{img.name}</option>
                })
              }
            </select> */}
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
            <img src="./header.png" className="logo-img"></img>
            <div className="demo-img-container">
              <img src="./wm-full-30.png" className="wm-img"></img>
              {/* <img src="/anhmau.jpg" className="demo-img"></img> */}
              {imgs.length == 0 ? <></> : <img src={imgs[0].src} className="demo-img"></img>}
            </div>
          </Col>
        </Row>
      </Container>
      {
        imgs.map((img, i) => {
          return <Col key={i.toString()} md="6" className="real-container">
            <img src="./header.png" className="logo-img"></img>
            <div className="real-img-container">
              <img src="./wm-full-30.png" className="wm-img"></img>
              <img src={img.src} className="real-img"></img>
            </div>
          </Col>
        })
      }
    </main >
  );
}
