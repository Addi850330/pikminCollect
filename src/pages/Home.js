import { useEffect, useState } from "react";
import style from "./Home.module.css";

const Home = () => {
  const [bgcNum, setBgcNum] = useState("");
  const [bgcShow, setBgcShow] = useState("hide");
  // ---------------------
  const [tagToggle, setTagToggle] = useState("close");
  // ----------------------------
  const [footer, setFooter] = useState("close");
  // -------------------------
  const [tagsData, setTagsData] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null); // 儲存被點擊的 tag
  // ---------------------
  const [checkedItems, setCheckedItems] = useState(() => {
    // 初始從 localStorage 讀取已勾選的項目
    const saved = localStorage.getItem("checkedItems");
    return saved ? JSON.parse(saved) : [];
  });
  // ----------------------------
  const [selectedTagIcon, setSelectedTagIcon] = useState("");
  const [selectedTagName, setSelectedTagName] = useState("");
  const [selectedTagNameEn, setSelectedTagNameEn] = useState("");
  useEffect(() => {
    // 產生 1~7 的亂數
    const randomNum = Math.floor(Math.random() * 7) + 1;
    setBgcNum(randomNum);
    setBgcShow("show");

    // 讀取資料
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => {
        setTagsData(json);
        if (json.length > 0) {
          setSelectedTag(json[0]); // 初始化時選擇第一個 tag
          setSelectedTagIcon(json[0].tagIconUrl); // 🔧 設定預設圖片
          setSelectedTagName(json[0].tagNameCH); // 🔧 設定預設名稱
          setSelectedTagNameEn(json[0].tagName); // 🔧 設定預設名稱
        }
      })
      .catch((err) => console.error("讀取錯誤:", err));
  }, []);

  const toggleCheck = (item_ID) => {
    setCheckedItems((prev) => {
      const updated = prev.includes(item_ID)
        ? prev.filter((id) => id !== item_ID)
        : [...prev, item_ID];

      localStorage.setItem("checkedItems", JSON.stringify(updated));
      return updated;
    });
  };

  const isTagCompleted = (tag) => {
    // 把 tag 裡所有 item 的 ID 平展成一個陣列
    const allItemIDs = tag.tagItems.flatMap((tagItem) =>
      tagItem.items.map((item) => item.item_ID)
    );

    // 檢查這些 ID 是否都存在於 checkedItems 裡
    return allItemIDs.every((id) => checkedItems.includes(id));
  };

  const tagSetOpen = () => {
    setTagToggle("open");
  };
  const tagSetClose = () => {
    setTagToggle("close");
  };

  const footerOpen = () => {
    setFooter("open");
  };
  const footerClose = () => {
    setFooter("close");
  };
  return (
    <div className={style.container}>
      <div className={style.logo}>
        <img src="./logo.png" alt="logo" />
      </div>
      <div className={style.bgcanime}></div>
      <div className={`${style.bgc} ${bgcShow === "show" ? style.show : ""}`}>
        <img src={`./bgc/bg${bgcNum}.png`} alt="background" />
      </div>
      <button className={style.tagtoggle} onClick={tagSetOpen}>
        <img className={style.click} src="./click.png" alt="click" />
        <img src="./togglebtn.png" alt="tbtn" />
        <p>飾品目錄</p>
      </button>
      <div className={style.collection}>
        <div className={style.items}>
          <div className={style.choiceIcon}>
            {selectedTagIcon && (
              <img src={selectedTagIcon} alt="selected tag" />
            )}
            <div className={style.selectedTagName}>{selectedTagName}</div>
            <div className={style.selectedTagNameEn}>{selectedTagNameEn}</div>
          </div>
          <div
            className={`${style.tags} ${
              tagToggle === "open" ? style.active : ""
            }`}
          >
            <button className={style.tagclosebtn} onClick={tagSetClose}>
              x
            </button>
            {tagsData.map((tag) => (
              <button
                key={tag.tag_ID}
                className={`${style.tagbtn} ${
                  selectedTag?.tag_ID === tag.tag_ID ? style.activeTag : ""
                }`}
                onClick={() => {
                  setSelectedTag(tag);
                  setSelectedTagIcon(tag.tagIconUrl);
                  setSelectedTagName(tag.tagNameCH);
                  setSelectedTagNameEn(tag.tagName);
                  tagSetClose();
                }}
              >
                <img src={tag.tagIconUrl} alt={tag.tagNameCH} />
                {isTagCompleted(tag) && (
                  <img
                    src="./check.svg"
                    alt="完成"
                    className={style.tagCheckIcon}
                  />
                )}
              </button>
            ))}
          </div>
          <div className={style.tagItems}>
            {selectedTag &&
              selectedTag.tagItems.map((tagItem) => (
                <div key={tagItem.items_ID} className={style.tagItemBlock}>
                  <h4>{tagItem.itemsName}</h4>
                  <p>{tagItem.itemNameEN}</p>
                  <div className={style.tagItemImages}>
                    {tagItem.items.map((item) => {
                      const isChecked = checkedItems.includes(item.item_ID);
                      return (
                        <button
                          key={item.item_ID}
                          className={style.checkbtn}
                          onClick={() => toggleCheck(item.item_ID)}
                        >
                          {isChecked && (
                            <img
                              className={style.check}
                              src="./imgcheck.svg"
                              alt="checked"
                            />
                          )}
                          <img
                            src={item.itemUrl}
                            alt={`item-${item.item_ID}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={`${style.footer} ${footer === "open" ? style.show : ""}`}>
        <button className={style.ccbtn} onClick={footerClose}>
          x
        </button>
        <p>
          © 2025 Yau-Shiuan Chang. 本網站由 Yau-Shiuan Chang
          製作，部分圖鑑資料來源於
          <a
            href="https://www.pikminwiki.com/Decor_Pikmin#Rare_Decor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pikmin Wiki
          </a>
          ， 原始內容採用
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA 4.0 授權
          </a>
          。 本網站對原始資料進行了整理與重新設計。
        </p>
        <p>
          This website was created by Yau-Shiuan Chang. Some information is
          adapted from
          <a
            href="https://www.pikminwiki.com/Decor_Pikmin#Rare_Decor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pikmin Wiki
          </a>
          , which is licensed under the
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creative Commons Attribution-ShareAlike 4.0 International License
          </a>
          . The original content has been modified and reformatted for this
          site.
        </p>
      </div>
      <button className={style.footeropen} onClick={footerOpen}>
        <img src="./footerbtn.png" alt="fbtn" />
      </button>
    </div>
  );
};

export default Home;
