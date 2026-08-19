import {
  apiRequest,
} from '../services/api';


/*
==================================================
SUBMIT DISTRIBUTOR REQUEST
==================================================

Backend:
POST /api/distributor-requests

Public endpoint.

Backend saves the request in PostgreSQL
and sends the Brevo notification email.
==================================================
*/

export async function submitDistributorRequest({
  fullName,
  phone,
  email,
  targetCity,
  investmentRange,
  businessExperience,
}) {

  /*
  ==================================================
  FRONTEND → BACKEND FIELD MAPPING
  ==================================================

  UI:
  phone
  targetCity

  Backend:
  phoneNumber
  targetLocation
  */

  const payload = {

    fullName:
      fullName.trim(),

    email:
      email.trim(),

    phoneNumber:
      phone.trim(),

    targetLocation:
      targetCity.trim(),

    investmentRange:
      investmentRange.trim(),

    businessExperience:
      businessExperience.trim(),
  };


  const response =
    await apiRequest(
      '/api/distributor-requests',
      'POST',
      payload,
    );


  return {
    success:
      response?.success === true,

    message:
      response?.message ||
      'Distributor request submitted successfully.',

    data:
      response?.data ||
      null,
  };
}