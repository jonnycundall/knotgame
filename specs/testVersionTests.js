describe('the testversion method is a tool for converting a live snake into a test script for one', 
         function(){
            it('should output the same as the test which made it',
               function()
               {
                   var snake1 = [snakePiece([1,2], false, UP, UP, 0),
                      snakePiece([1,1], false, UP, UP, 0)];
                   expect(snake1.testVersion
                          ).toBe('[snakePiece([1,2], false, UP, UP, 0),snakePiece([1,1], false, UP, UP, 0)]');
               });
         
         });