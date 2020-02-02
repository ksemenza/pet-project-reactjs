import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

// props from Formik => values, errors, touched, status
// these are prefixed props sent from Formik into AnimalForm because AnimalForm is wrapped by withFormik HOC
// values => state of inputs & updates with change in input
// errors => any errors from Yup validation
// touched => when an input has be entered and moved away from by user
// status => when chagne from API has updated via setStatus
const AnimalForm = ({ values, errors, touched, status }) => {
  // console.log("values", values);
  // console.log("errors", errors);
  // console.log("touched", touched);

  // local state that holds successful form submission data
  const [animals, setAnimals] = useState([]);

  // listens for status changes to update animals state
  useEffect(() => {
    console.log("status has changed!", status);
    // if status has content (an obj from API response) then render function setAnimals
    // use a spread to create a new array with all of animals' previous values + the new obj from the API stored in status
    // could be setAnimals([...animals, status]) but that fires a warning that we should watch animals. We don't need to watch for animals changes (this is the only place it could change)
    // change to animals => [...animals, status] to read in the current value of animals, and then use it to create a new array
    status && setAnimals(animals => [...animals, status]);
  }, [status]);
  return (
    <div className="animal-form">
      {/* Form automagically applies handleSubmit from withFormik options declared below*/}
      <Form>
        {/* can wrap Field with label to apply label. Need id on Field to create association*/}
        <label htmlFor="species">
          Species
          {/* name is the key within values (the current state of the form inputs) */}
          <Field
            id="species"
            type="text"
            name="species"
            placeholder="species"
          />
          {/* touched is if input has been visited, errors are captured from Yup validation. 
          If has been visited && errors exist for that input => render JSX to show errors*/}
          {touched.species && errors.species && (
            <p className="errors">{errors.species}</p>
          )}
        </label>
        <label htmlFor="size">
          Size
          <Field id="size" type="text" name="size" placeholder="size" />
          {touched.size && errors.size && (
            <p className="errors">{errors.size}</p>
          )}
        </label>
        {/* For Fields that use input elements other thank <input /> use as to declare what HTML input to use for Field*/}
        <Field as="select" className="food-select" name="diet">
          <option disabled>Choose an Option</option>
          <option value="herbivore">Herbivore</option>
          <option value="carnivore">Carnivore</option>
          <option value="omnivore">Omnivore</option>
        </Field>
        <label className="checkbox-container">
          Vaccinations
          <Field
            type="checkbox"
            name="vaccinations"
            checked={values.vaccinations}
          />
          <span className="checkmark" />
        </label>
        <Field as="textarea" type="text" name="notes" placeholder="Notes" />
        <button type="submit">Submit!</button>
      </Form>
      {animals.map(animal => {
        return (
          <ul key={animal.id}>
            <li>Species: {animal.species}</li>
            <li>Size: {animal.size}</li>
          </ul>
        );
      })}
    </div>
  );
};

const FormikAnimalForm = withFormik({
  // props from <AnimalForm /> in app are in props param
  mapPropsToValues(props) {
    // set initial state of form to value from parent component OR the initial value (after || )
    return {
      species: props.species || "",
      size: props.size || "",
      diet: props.diet || "",
      vaccinations: props.vaccinations || false,
      notes: props.notes || ""
    };
  },

  // Declare shape and requirement of values object (form state )
  validationSchema: Yup.object().shape({
    species: Yup.string().required(),
    // passing a string in required makes a custom inline error msg
    size: Yup.string().required("SIZE IS MANDATORY")
  }),

  // passed through props (magically) to Form component in Formik
  // fires when button type=submit is fired
  // values = state of form, formikBag is second param
  // in FormikBag: setStatus (sends API response to AnimalForm) & resetForm (clears form when called)
  handleSubmit(values, { setStatus, resetForm }) {
    console.log("submitting", values);
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log("success", res);
        // sends a status update through props in AnimalForm with value as res.data content
        setStatus(res.data);

        //clears form inputs, from FormikBag
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(AnimalForm);
export default FormikAnimalForm;
