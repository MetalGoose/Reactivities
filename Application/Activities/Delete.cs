using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest 
        {
            public Guid Id { get; set; }
        }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _contex;
        
            public Handler(DataContext contex)
            {
                _contex = contex;
            }
        
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _contex.Activities.FindAsync(request.Id);
                
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new {activity = "Not found"});
                
                _contex.Remove(activity);

                var success = await _contex.SaveChangesAsync() > 0;
        
                if (success) return Unit.Value;
        
                throw new ApplicationException("Problem saving changes");
            }
        }
    }
}