#!/usr/bin/env python3

import json
from chembl_webresource_client.new_client import new_client

listOfTargets = ["CHEMBL325","CHEMBL1937", "CHEMBL1829", "CHEMBL3524", "CHEMBL2563", "CHEMBL1865", "CHEMBL2716", "CHEMBL3192", "CHEMBL4145", "CHEMBL5103", "CHEMBL3310"]
listOfMolecules = ["CHEMBL98","CHEMBL99", "CHEMBL27759", "CHEMBL2018302", "CHEMBL483254", "CHEMBL1213490", "CHEMBL356769", "CHEMBL272980", "CHEMBL430060", "CHEMBL1173445", "CHEMBL356066", "CHEMBL1914702"]

dic = []

"""
Function that allows to store the ids of the molecules and targets and the corresponding pchembl value, 
that were retrieve using chembl_webresource_client, in a JSON object

Return: [JSON Object]
"""
def get_data():
    
    for target in listOfTargets:
        for mol in listOfMolecules:
            activities = new_client.activity
            res = activities.filter(molecule_chembl_id=mol, target_chembl_id=target,pchembl_value__isnull=False)
            if len(res) != 0:
                for i in range(0, len(res)):
                    dic.append({
                        'target_chembl_id': res[i]["target_chembl_id"],
                        'molecule_chembl_id': res[i]["molecule_chembl_id"],
                        'pchembl_value': res[i]["pchembl_value"]
                    })
    with open('data.json', 'w') as outfile:
        json.dump(dic, outfile)
    return dic
