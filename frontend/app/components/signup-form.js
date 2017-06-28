import Ember from 'ember';

const { inject: { service }, Component } = Ember;

export default Component.extend({
  errorExists(response) {
    let mapper = {
      422: "Your email already exists in our records. Please log in."
    }

    try {
      if (response.error && response.error[0]) {
        return response.error[0]
      } else if (response.error && response.error.statusCode) {
        let code = response.error.statusCode
        if (mapper[code]) return mapper[code]
        else return code
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      // may need more sophisticated handling here depending upon
      // type of error
      return error
    }
  },

  actions: {
    signupWithBasic() {

      let config = Ember.getOwner(this).resolveRegistration('config:environment')
      let endpoint = config.apiHost + '/api/Clients/'

      this.set('errorMessage', '');

      let { identification, password } = this.getProperties('identification', 'password');
      if (!identification || !password) {
        let errorString = "Please enter an email and password."
        this.set('errorMessage', errorString);
      } else {
        this.setProperties({isProcessing: true})
        // assigning to vm to access in ajax handling scope
        var vm = this
        Ember.$.ajax({
          url: endpoint,
          type: 'POST',
          crossDomain: true,
          data: JSON.stringify({
            email: identification,
            password: password
          }),
          contentType: 'application/json'
        }).then(function(response){
          // console.log('RESPONSE', response)
          vm.setProperties({
            isProcessing: false,
            isRegistered: true
          })
        }, function(xhr, status) {
          vm.setProperties({
            isProcessing: false
          })
          var response = xhr.responseText;
          response = JSON.parse(response)
          // console.log('STATUS', status)
          // console.log('SIGNUP ERROR: ', response);
          let error = vm.errorExists(response)
          if (error) {
            vm.set('errorMessage', error);
          }
        });
      }
    }
  }
});
