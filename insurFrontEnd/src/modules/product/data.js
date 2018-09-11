export default [
  {
    "name"	: "Motor",
    "icon"	: "car",
    "block" : [
        {
          "name"		: "Customer",
          "required"	: true,
          "rows": 
            [
              {
                "fields": 
                  [
                    {
                      "label": "Customer type",
                      "name": "customer_type",
                      "placeholder": "Customer type",
                      "className": "form-control",
                      "col": 5,
                      "defaultValue": null,
                      "valid": "str",
                      "type": "select",
                      "options":[
                        {"text": "Personal", "value": 1, "key": 1},
                        {"text": "Enterprise","value": 2, "key": 2}
                      ]
                      
                    },
                    {
                      "label": "Policy holder",
                      "name": "policy_holder",
                      "placeholder": "Customer type",
                      "className": "",
                      "col": 8,
                      "defaultValue": null,
                      "valid": "str",
                      "type": "text",
                      "options": null
                    }
                  ]
              },
              {
                "fields": 
                  [
                    {
                      "label": "ID number",
                      "name": "id_number",
                      "placeholder": "ID number",
                      "className": "form-control",
                      "defaultValue": null,
                      "valid": "str"
                    },
                    {
                      "label": "Tax number",
                      "name": "tax_number",
                      "placeholder": "Tax number",
                      "className": "form-control",
                      "defaultValue": null,
                      "valid": "str"
                    },
                    {
                      "label": "Phone number",
                      "name": "phone_number",
                      "placeholder": "Phone number",
                      "className": "form-control",
                      "defaultValue": "0963501008",
                      "valid": "str"
                    }
                  ]
              }
            ]
        },
        {
          "name"		: "INHERITOR",
          "required"	: false,
          "rows": 
            [
              {
                "fields": 
                  [
                    {
                      "label": "Use customer information",
                      "name": "use_cus_info",
                      "className": "text-area",
                      "col": 3,
                      "valid": "str",
                      "type": "checkbox",
                    },
                    {
                      "label": "Inheritor",
                      "name": "inheritor",
                      "col": 5,
                      "placeholder": "Inheritor",
                      "className": "form-control",
                      "defaultValue": "Ngân hàng TMCP Bản Việt Quận 2",
                      "valid": "str"
                    },
                    {
                      "label": "Address",
                      "name": "address",
                      "col": 5,
                      "placeholder": "Address",
                      "className": "form-control",
                      "defaultValue": "186 Nam Kỳ Khởi Nghĩa, Q3, TPHCM",
                      "valid": "str"
                    }
                  ]
              },
              {
                "fields": 
                  [
                    {
                      "label": "Tax number",
                      "name": "tax_number",
                      "placeholder": "Tax number",
                      "className": "form-control",
                      "defaultValue": "0963501008",
                      "valid": "str"
                    }
                  ]
              }
            ]
        },
        {
          "name"		: "PRODUCT",
          "required"	: false,
          "rows": 
            [
              {
                "fields": 
                  [
                    {
                      "label": "Purpose of use",
                      "name": "purpose_of_use",
                      "placeholder": "Purpose of use",
                      "className": "form-control",
                      "defaultValue": null,
                      "valid": "str",
                      "type": "select",
                      "options":[
                        {"text": "Transport business", "value": 1, "key": 1},
                        {"text": "Non transport business","value": 2, "key": 2}
                      ]
                    },
                    {
                      "label": "Car type",
                      "name": "car_type",
                      "placeholder": "Car type",
                      "className": "form-control",
                      "defaultValue": null,
                      "valid": "str",
                      "type": "select",
                      "options":[
                        {"text": "Pickup truck (Pickup)", "value": 1, "key": 1},
                        {"text": "Car","value": 2, "key": 2}
                      ]
                    },
                    {
                      "label": "Address",
                      "name": "address",
                      "col": 6,
                      "placeholder": "Address",
                      "className": "form-control",
                      "defaultValue": "186 Nam Kỳ Khởi Nghĩa, Q3, TPHCM",
                      "valid": "str"
                    }
                  ]
              },
              {
                "fields": 
                  [
                    {
                      "label": "Sum insured (VNĐ)",
                      "name": "sum_insured",
                      "placeholder": "Sum insured (VNĐ)",
                      "valid": "str"
                    },
                    {
                      "label": "Year of manufacture",
                      "name": "year_of_manufacture",
                      "placeholder": "Year of manufacture",
                      "valid": "str"
                    },
                    {
                      "label": "Number of seats",
                      "name": "number_of_seats",
                      "placeholder": "Number of seats",
                      "valid": "str"
                    }
                  ]
              },
              {
                "fields": 
                  [
                    {
                      "label": "Car weight (ton)",
                      "name": "car_weight",
                      "col": 16,
                      "placeholder": "Car weight (ton)",
                      "valid": "str"
                    }
                  ]
              }
            ]
        },
        {
          "name"		: "Comment",
          "required"	: true,
          "rows": 
            [
              {
                "fields": 
                  [
                    {
                      "label": "Comment",
                      "name": "comment",
                      "placeholder": "Comment",
                      "className": "text-area",
                      "col": 16,
                      "valid": "str",
                      "type": "textArea",
                      "rows": 5
                    }
                  ]
              }
            ]
        }
      ]
    }
  ];