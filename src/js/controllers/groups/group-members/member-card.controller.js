angular
  .module('stagApp')
  .controller('MemberCardCtrl', MemberCardCtrl);

MemberCardCtrl.$inject = ['member', '$uibModalInstance', '$state'];
function MemberCardCtrl(member, $uibModalInstance, $state) {

  const vm = this;
  vm.close = closeModal;
  vm.member = member;


  function closeModal() {
    $uibModalInstance.close();
  }

}
