import React, { useEffect, useState, CSSProperties } from "react";
import { useSigma } from "@react-sigma/core";
import { useCamera } from "@react-sigma/core";
import { useRegisterEvents } from "@react-sigma/core" 
import { getUniqueKey } from "./getUniqueKey";
import truncateAddress from "./truncateAddress";
/**
 * Properties for `SearchControl` component
 */
export const SearchControl = ({
  id,
  className,
  style,
  labels = {},
}) => {
  // Get sigma
  const sigma = useSigma();
  // Get event hook
  const registerEvents = useRegisterEvents();
  // Get camera hook
  const { gotoNode } = useCamera();
  // Search value
  const [search, setSearch] = useState("");
  // Datalist values
  const [values, setValues] = useState([]);
  // Selected
  const [selected, setSelected] = useState(null);
  // random id for the input
  const [inputId, setInputId] = useState("");
  //render out the message whether the searched address was found or not 
  const [message, setMessage] = useState(""); 
  //set the timeout limit for the displayed message using UseState Hook 
  const [time, setTimeLimit] = useState(false); 

  /**
   * When component mounts, set a random input id.
   */
  useEffect(() => {
    setInputId(`search-${getUniqueKey()}`);
  }, []);

  /**
   * When the search input changes, recompute the autocomplete values.
   */
  useEffect(() => {
    const newValues = [];
    if (!selected && search.length > 1) {
      sigma.getGraph().forEachNode((key, attributes) => {
        if (attributes.label && attributes.label.toLowerCase().includes(search.toLowerCase())){
            if (attributes.walletId) {
                newValues.push({ id: key, label: attributes.walletId });
            }
            else {
                newValues.push({ id: key, label: attributes.hash });
            }
        }   
      });
    }
    setValues(newValues);
  }, [search]);

  /**
   * When user clicks on the stage
   *  => reset the selection
   */
  useEffect(() => {
    registerEvents({
      clickStage: () => {
        setSelected(null);
        setSearch("");
      },
    });
  }, [registerEvents]);

  /**
   * When the selected item changes, highlight the node and center the camera on it.
   */
  useEffect(() => {
    if (!selected) {
      return;
    }
    const color = selected.color
    sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
    sigma.getGraph().setNodeAttribute(selected, "color", "#E62600");
    gotoNode(selected);

    return () => {
      sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
      sigma.getGraph().setNodeAttribute(selected, "color", selected.color);
    };
  }, [selected]);

  /**
   * On change event handler for the search input, to set the state.
   */
  const onInputChange = (e) => {
    const searchString = e.target.value;
    const valueItem = values.find((value) => value.label === searchString);
    if (valueItem) {
        if (valueItem.walletId){
            setSearch(valueItem.walletId);
        }
        else { 
            setSearch(valueItem.hash);
        }
      setValues([]);
      setSelected(valueItem.id);
      setMessage("node/transaction found succesfully");
      setTimeLimit(true)
    } else {
      setSelected(null);
      setSearch(searchString);
      setMessage("Unable to find node. Please enter valid address!")
      setTimeLimit(true); 
    }

    setTimeout(() => {
        setTimeLimit(false); 
    }, 3000);
  };

  // Common html props for the div
  const htmlProps = {
    className: `react-sigma-search ${className ? className : ""}`,
    id,
    style,
  };

  return (
    <div {...htmlProps}>
      <label htmlFor={inputId} style={{ display: "none" }}>
        {labels["text"] || "Search a node"}
      </label>
      <input
        id={inputId}
        type="text"
        placeholder={labels["placeholder"] || "Search..."}
        list={`${inputId}-datalist`}
        value={search}
        onChange={onInputChange}
      />
      <datalist id={`${inputId}-datalist`}>
        {values.map((value) => (
          <option key={value.id} value={value.label}>
            {value.label}
          </option>
        ))}
      </datalist>
      <div className={!time ? "hidden" : ""} style={{
            color: "green",
            border: "1px solid red",
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px"}}>
                {message}
        </div>
    </div>
  );
};
