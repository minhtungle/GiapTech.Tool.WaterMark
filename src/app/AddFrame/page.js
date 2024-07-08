'use client'
import { useState } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from "../page.module.css";
import { Container, Row, Col, Form, Button, ButtonGroup } from "react-bootstrap";
import { Icon } from '../components/Icon';
// import Select from 'react-select'
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function Home() {
  const [imgs, setImgs] = useState([{
    src: "./anhmau.jpg",
    name: "Không 1 cuộc gọi nhỡ.jpg",
    checked: true
  }]);
  const [wmImgs, setWmImgs] = useState([{
    src: "./wm-40.png",
    name: "To chà bá",
    className: "wm-img",
    checked: true
  }, {
    src: "./wm-full-40.png",
    name: "Tùm lum tè le",
    className: "wm-full-img",
    checked: false
  }, {
    src: "",
    name: "Full HD không che",
    className: "wm-full-img",
    checked: false
  },
  ]);

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
  const changeWmImg = (newValue, actionMeta) => {
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
    };
    let wmImgs_NEW = wmImgs.map(wmImg => {
      wmImg.checked = false;
      if (wmImg.name == newValue.label) {
        wmImg.checked = true;
      };
      return { ...wmImg };
    })
    setWmImgs(wmImgs_NEW);
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
          <Col md="6" className="list-imgs-container d-flex justify-content-center">
            <Form className="w-100">
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Chọn ảnh watermark</Form.Label>
                {
                  (() => {
                    let options = wmImgs.map(img => ({
                      value: img.src, label: img.name
                    }));
                    return <Select
                      defaultValue={options[0]}
                      options={options}
                      onChange={changeWmImg}
                      id="select-wm-imgs" />
                  })()
                }
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Chọn ảnh cần ghép</Form.Label>
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
              </Form.Group>
              <div className="d-flex justify-content-center">
                <ButtonGroup className="w-100">
                  <Button variant="primary" onClick={() => uploadImgs()}>
                    <Icon
                      iconName="Upload"
                      color=""
                      className="align-center" />
                    &ensp;Tải lên</Button>
                  <Button variant="success" onClick={() => downloadImgs()}>
                    <Icon
                      iconName="Download"
                      color=""
                      className="align-center" />
                    &ensp;Tải xuống</Button>
                </ButtonGroup>
              </div>
            </Form>
          </Col>
          <Col md="6" className="d-flex justify-content-center">
            <div className="demo-container">
              {/* <img src="/logo-full.png" className="logo-img"></img> */}
              <img src="./header.png" className="logo-img"></img>
              <div className="demo-img-container">
                {
                  (() => {
                    let wmImg = wmImgs.filter(x => x.checked)[0];
                    let src = wmImg.src;
                    let className = wmImg.className;
                    if (src != "")
                      return <img src={src} className={className}></img>
                    return <></>;
                  })()
                }
                {imgs.length == 0 ? <></> : <img src={imgs[0].src} className="demo-img"></img>}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="my-2">
        <Row>
          {
            imgs.map((img, i) => {
              return <Col key={i.toString()} md="12" className="d-flex justify-content-center">
                <div className="real-container">
                  <img src="./header.png" className="logo-img"></img>
                  <div className="real-img-container">
                    {
                      (() => {
                        let wmImg = wmImgs.filter(x => x.checked)[0];
                        let src = wmImg.src;
                        let className = wmImg.className;
                        if (src != "")
                          return <img src={src} className={className}></img>
                        return <></>;
                      })()
                    }
                    <img src={img.src} className="real-img"></img>
                  </div>
                </div>
              </Col>
            })
          }
        </Row>
      </Container>
    </main >
  );
}
