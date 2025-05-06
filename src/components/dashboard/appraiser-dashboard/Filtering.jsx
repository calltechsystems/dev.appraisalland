import { FaRedo } from "react-icons/fa";

const Filtering = ({ setRefresh, FilteringType, setFilteringType }) => {
  const refreshHandler = () => {
    setFilteringType(1000);
    setRefresh(true);
  };
  return (
    <>
      <div className="col=lg-12">
        <div className="row">
          <div className="col-lg-9">
            <select
              className="selectpicker show-tick form-select c_select"
              value={FilteringType}
              onChange={(e) => setFilteringType(e.target.value)}
            >
              <option value={1000}>All</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
          <div className="col-lg-3">
            <button
              className="btn btn-color w-100"
              onClick={refreshHandler}
              title="Refresh"
              style={{ padding: "10px", marginTop: "2px" }}
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filtering;
