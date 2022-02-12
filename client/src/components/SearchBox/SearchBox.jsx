
//Style
import "./style.scss";


const SearchBox = () => {
  return (
    <div className="search-container">
      <h3>البحث المتقدم</h3>
      <div className="search-box">
        <input type="text" placeholder="اسم المستخدم" id="username-search" />
        <input type="text" placeholder="البريد الالكتروني" id="email-search" />
        <input type="text" placeholder="الاسم" id="name-search" />
        <input type="text" placeholder="رقم الهاتف" id="phone-search" />
        <input type="number" placeholder="#" id="id-search" />
        <div className="select-item">
          <select id="lvl-search" onClick={() => "rotateSelect(this)"}>
            <option value="">المستوي</option>
            <option value="مدير">مدير</option>
            <option value="مشرف">مشرف</option>
            <option value="فني">فني</option>
          </select>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
