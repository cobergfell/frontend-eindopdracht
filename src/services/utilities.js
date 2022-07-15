
export const sortDataBy = (data, byKey)  => {
    let sortedData;
    if(byKey == 'name'){
        sortedData = data.sort(function(a,b){
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if(x>y){return 1;}
            if(x<y){return -1;}
            return 0;
        });
    }
    else if(byKey == 'answerId'){
        sortedData = data.sort(function(a,b){
            return a.answerId - b.answerId;
        });

    }
    else if(byKey == 'questionId'){
        sortedData = data.sort(function(a,b){
            return a.questionId - b.questionId;
        });

    }

    else {
        sortedData = data.sort(function(a,b){
            return a.id - b.id;
        })
    }
    return sortedData;
}

